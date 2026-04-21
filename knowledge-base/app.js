// ===== 知识库应用主逻辑 =====
(function(){
'use strict';

// ===== 数据持久化 =====
const STORE_KEYS = { users:'kb_users', categories:'kb_categories', articles:'kb_articles', history:'kb_history' };

function loadStore(key, defaults) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : JSON.parse(JSON.stringify(defaults)); }
  catch(e) { return JSON.parse(JSON.stringify(defaults)); }
}
function saveStore(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

let users = loadStore(STORE_KEYS.users, DEFAULT_USERS);
let categories = loadStore(STORE_KEYS.categories, DEFAULT_CATEGORIES);
let articles = loadStore(STORE_KEYS.articles, DEFAULT_ARTICLES);
let history = loadStore(STORE_KEYS.history, []);

function persist() {
  saveStore(STORE_KEYS.users, users);
  saveStore(STORE_KEYS.categories, categories);
  saveStore(STORE_KEYS.articles, articles);
  saveStore(STORE_KEYS.history, history);
}

// ===== 会话 =====
let currentUser = null;
let currentPage = 'home';
let currentArticleId = null;

function hasPerm(perm) {
  if (!currentUser) return false;
  return (ROLE_PERMS[currentUser.role] || []).includes(perm);
}

function canViewArticle(art) {
  if (!currentUser) return false;
  if (art.visibility === 'all') return true;
  if (art.visibility === 'trainer' && (currentUser.role === 'trainer' || currentUser.role === 'admin')) return true;
  if (art.visibility === 'admin' && currentUser.role === 'admin') return true;
  return false;
}

// ===== 登录 =====
window.doLogin = function() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPwd').value.trim();
  const found = users.find(x => x.username === u && x.password === p);
  if (!found) { document.getElementById('loginError').textContent = '用户名或密码错误'; return; }
  currentUser = found;
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  renderApp();
};

window.doLogout = function() {
  currentUser = null;
  currentPage = 'home';
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPwd').value = '';
  document.getElementById('loginError').textContent = '';
};

// ===== 渲染 =====
function renderApp() {
  renderUserBadge();
  renderSidebar();
  renderContent();
}

function renderUserBadge() {
  const el = document.getElementById('userBadge');
  el.textContent = currentUser.name + ' (' + ROLE_LABELS[currentUser.role] + ')';
  el.className = 'user-badge ' + currentUser.role;
}

function renderSidebar() {
  let html = '';
  // 首页
  html += '<div class="nav-item' + (currentPage === 'home' ? ' active' : '') + '" onclick="navTo(\'home\')">'
    + '<span class="nav-icon">🏠</span>首页</div>';
  // 搜索
  html += '<div class="nav-item' + (currentPage === 'search' ? ' active' : '') + '" onclick="navTo(\'search\')">'
    + '<span class="nav-icon">🔍</span>搜索</div>';
  html += '<div class="nav-divider"></div>';

  // 分类
  categories.sort((a,b) => a.order - b.order).forEach(cat => {
    const catArticles = articles.filter(a => a.categoryId === cat.id && canViewArticle(a));
    if (catArticles.length === 0) return;
    html += '<div class="nav-category"><div class="nav-category-title">' + cat.icon + ' ' + cat.name + '</div></div>';
    catArticles.forEach(art => {
      const active = currentPage === 'article' && currentArticleId === art.id;
      html += '<div class="nav-item' + (active ? ' active' : '') + '" onclick="navToArticle(\'' + art.id + '\')">'
        + '<span class="nav-icon">📄</span>' + art.title + '</div>';
    });
  });

  // 管理入口
  if (hasPerm('edit') || hasPerm('manage_users')) {
    html += '<div class="nav-divider"></div>';
    html += '<div class="nav-item admin-only' + (currentPage === 'admin' ? ' active' : '') + '" onclick="navTo(\'admin\')">'
      + '<span class="nav-icon">⚙️</span>后台管理</div>';
  }

  document.getElementById('sidebarNav').innerHTML = html;
}

function renderContent() {
  const el = document.getElementById('contentArea');
  if (currentPage === 'home') el.innerHTML = renderHome();
  else if (currentPage === 'search') el.innerHTML = renderSearch();
  else if (currentPage === 'article') el.innerHTML = renderArticle();
  else if (currentPage === 'admin') el.innerHTML = renderAdmin();
}

// ===== 首页 =====
function renderHome() {
  const visibleArticles = articles.filter(a => canViewArticle(a));
  const catCount = new Set(visibleArticles.map(a => a.categoryId)).size;
  let html = '<div class="page-title">欢迎回来，' + currentUser.name + '</div>'
    + '<div class="page-desc">周黑鸭24小时值守团队知识库</div>';

  html += '<div class="stats-grid">'
    + '<div class="stat-card"><div class="stat-num orange">' + visibleArticles.length + '</div><div class="stat-label">知识文档</div></div>'
    + '<div class="stat-card"><div class="stat-num red">' + catCount + '</div><div class="stat-label">知识分类</div></div>'
    + '<div class="stat-card"><div class="stat-num blue">' + history.length + '</div><div class="stat-label">更新记录</div></div>'
    + '<div class="stat-card"><div class="stat-num green">' + users.length + '</div><div class="stat-label">系统用户</div></div>'
    + '</div>';

  html += '<div class="card"><h2>📚 快速导航</h2><div class="quick-links">';
  categories.forEach(cat => {
    const count = articles.filter(a => a.categoryId === cat.id && canViewArticle(a)).length;
    if (count === 0) return;
    html += '<div class="quick-link" onclick="navToCategory(\'' + cat.id + '\')">'
      + '<div class="ql-icon">' + cat.icon + '</div>'
      + '<div><div class="ql-text">' + cat.name + '</div><div class="ql-desc">' + count + ' 篇文档</div></div></div>';
  });
  html += '</div></div>';

  // 最近更新
  const recent = [...visibleArticles].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  if (recent.length) {
    html += '<div class="card"><h2>🕐 最近更新</h2>';
    recent.forEach(art => {
      const cat = categories.find(c => c.id === art.categoryId);
      html += '<div style="padding:10px 0;border-bottom:1px solid #f0f0f0;cursor:pointer;" onclick="navToArticle(\'' + art.id + '\')">'
        + '<div style="font-size:14px;font-weight:600;color:#333;">' + art.title + '</div>'
        + '<div style="font-size:12px;color:#999;margin-top:4px;">' + (cat ? cat.icon + ' ' + cat.name : '') + ' · ' + art.updatedAt + ' · v' + art.version + '</div>'
        + '</div>';
    });
    html += '</div>';
  }
  return html;
}

// ===== 搜索 =====
function renderSearch() {
  return '<div class="page-title">🔍 搜索知识库</div>'
    + '<div class="search-bar"><input type="text" id="searchInput" placeholder="输入关键词搜索..." oninput="doSearch()"></div>'
    + '<div id="searchResults"></div>';
}

window.doSearch = function() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const el = document.getElementById('searchResults');
  if (!q) { el.innerHTML = '<div style="text-align:center;color:#999;padding:40px;">输入关键词开始搜索</div>'; return; }

  const results = articles.filter(a => canViewArticle(a) && (
    a.title.toLowerCase().includes(q) || a.content.replace(/<[^>]+>/g, '').toLowerCase().includes(q)
  ));

  if (!results.length) { el.innerHTML = '<div style="text-align:center;color:#999;padding:40px;">未找到相关内容</div>'; return; }

  let html = '';
  results.forEach(art => {
    const cat = categories.find(c => c.id === art.categoryId);
    const plain = art.content.replace(/<[^>]+>/g, '');
    const idx = plain.toLowerCase().indexOf(q);
    let snippet = '';
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(plain.length, idx + q.length + 60);
      snippet = (start > 0 ? '...' : '') + plain.substring(start, end).replace(new RegExp(q, 'gi'), '<mark>$&</mark>') + (end < plain.length ? '...' : '');
    }
    html += '<div class="search-result-item" onclick="navToArticle(\'' + art.id + '\')">'
      + '<div class="sr-title">' + art.title.replace(new RegExp(q, 'gi'), '<mark>$&</mark>') + '</div>'
      + '<div class="sr-cat">' + (cat ? cat.icon + ' ' + cat.name : '') + '</div>'
      + (snippet ? '<div class="sr-snippet">' + snippet + '</div>' : '')
      + '</div>';
  });
  el.innerHTML = html;
};

// ===== 文章详情 =====
function renderArticle() {
  const art = articles.find(a => a.id === currentArticleId);
  if (!art) return '<div class="card">文章不存在</div>';
  const cat = categories.find(c => c.id === art.categoryId);

  let html = '<div class="page-title">' + art.title + '</div>'
    + '<div class="page-desc">' + (cat ? cat.icon + ' ' + cat.name : '') + ' · 更新于 ' + art.updatedAt + ' · 版本 v' + art.version
    + (art.visibility !== 'all' ? ' · <span class="role-tag ' + art.visibility + '">' + (art.visibility === 'trainer' ? '培训师+' : '管理员') + '</span>' : '')
    + '</div>';

  if (hasPerm('edit')) {
    html += '<div style="margin-bottom:16px;">'
      + '<button class="btn-add" onclick="openEditArticle(\'' + art.id + '\')">✏️ 编辑</button> '
      + '<button class="btn-sm btn-outline" onclick="showArticleHistory(\'' + art.id + '\')">📜 版本历史</button>'
      + '</div>';
  }

  html += '<div class="card">' + art.content + '</div>';
  return html;
}

// ===== 后台管理 =====
function renderAdmin() {
  if (!hasPerm('edit') && !hasPerm('manage_users')) return '<div class="card">无权限</div>';

  let html = '<div class="page-title">⚙️ 后台管理</div><div class="page-desc">管理知识库内容、用户和分类</div>';

  // 文章管理
  html += '<div class="card"><h2>📄 文章管理 <button class="btn-add" style="float:right;font-size:12px;" onclick="openEditArticle()">➕ 新增文章</button></h2>';
  html += '<table class="admin-table"><tr><th>标题</th><th>分类</th><th>可见范围</th><th>版本</th><th>更新时间</th><th>操作</th></tr>';
  articles.forEach(art => {
    const cat = categories.find(c => c.id === art.categoryId);
    const visLabel = art.visibility === 'all' ? '全员' : art.visibility === 'trainer' ? '培训师+' : '管理员';
    html += '<tr><td>' + art.title + '</td><td>' + (cat ? cat.icon + ' ' + cat.name : '-') + '</td>'
      + '<td><span class="role-tag ' + art.visibility + '">' + visLabel + '</span></td>'
      + '<td>v' + art.version + '</td><td>' + art.updatedAt + '</td>'
      + '<td><button class="btn-xs btn-edit" onclick="openEditArticle(\'' + art.id + '\')">编辑</button> '
      + '<button class="btn-xs btn-hist" onclick="showArticleHistory(\'' + art.id + '\')">历史</button> '
      + (hasPerm('delete') ? '<button class="btn-xs btn-del" onclick="deleteArticle(\'' + art.id + '\')">删除</button>' : '')
      + '</td></tr>';
  });
  html += '</table></div>';

  // 用户管理（仅管理员）
  if (hasPerm('manage_users')) {
    html += '<div class="card"><h2>👥 用户管理 <button class="btn-add" style="float:right;font-size:12px;" onclick="openEditUser()">➕ 新增用户</button></h2>';
    html += '<table class="user-table"><tr><th>用户名</th><th>姓名</th><th>角色</th><th>操作</th></tr>';
    users.forEach((u, i) => {
      html += '<tr><td>' + u.username + '</td><td>' + u.name + '</td>'
        + '<td><span class="role-tag ' + u.role + '">' + ROLE_LABELS[u.role] + '</span></td>'
        + '<td><button class="btn-xs btn-edit" onclick="openEditUser(' + i + ')">编辑</button> '
        + (u.username !== 'admin' ? '<button class="btn-xs btn-del" onclick="deleteUser(' + i + ')">删除</button>' : '')
        + '</td></tr>';
    });
    html += '</table></div>';
  }

  // 更新日志
  html += '<div class="card"><h2>📜 更新日志（最近20条）</h2>';
  if (history.length === 0) {
    html += '<div style="text-align:center;color:#999;padding:20px;">暂无记录</div>';
  } else {
    const recent = history.slice(-20).reverse();
    recent.forEach(h => {
      html += '<div class="history-item">'
        + '<div class="history-meta"><span>📅 ' + h.time + '</span><span>👤 ' + h.user + '</span>'
        + '<span class="history-action ' + h.action + '">' + ({create:'新增',update:'更新','delete':'删除'}[h.action] || h.action) + '</span></div>'
        + '<div style="font-size:13px;color:#555;">' + h.detail + '</div></div>';
    });
  }
  html += '</div>';

  return html;
}

// ===== 导航 =====
window.navTo = function(page) { currentPage = page; currentArticleId = null; renderSidebar(); renderContent(); closeSidebar(); };
window.navToArticle = function(id) { currentPage = 'article'; currentArticleId = id; renderSidebar(); renderContent(); closeSidebar(); };
window.navToCategory = function(catId) {
  const first = articles.find(a => a.categoryId === catId && canViewArticle(a));
  if (first) navToArticle(first.id);
};
window.toggleSidebar = function() { document.getElementById('sidebar').classList.toggle('open'); };
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }

// ===== 编辑文章 =====
window.openEditArticle = function(id) {
  const art = id ? articles.find(a => a.id === id) : null;
  const isNew = !art;
  document.getElementById('editModalTitle').textContent = isNew ? '新增文章' : '编辑文章';

  let catOpts = categories.map(c => '<option value="' + c.id + '"' + (art && art.categoryId === c.id ? ' selected' : '') + '>' + c.icon + ' ' + c.name + '</option>').join('');
  let visOpts = '<option value="all"' + (art && art.visibility === 'all' ? ' selected' : '') + '>全员可见</option>'
    + '<option value="trainer"' + (art && art.visibility === 'trainer' ? ' selected' : '') + '>培训师+管理员</option>'
    + '<option value="admin"' + (art && art.visibility === 'admin' ? ' selected' : '') + '>仅管理员</option>';

  document.getElementById('editModalBody').innerHTML =
    '<div class="editor-group"><label>标题</label><input type="text" id="editTitle" value="' + (art ? art.title.replace(/"/g, '&quot;') : '') + '"></div>'
    + '<div class="editor-group"><label>分类</label><select id="editCategory">' + catOpts + '</select></div>'
    + '<div class="editor-group"><label>可见范围</label><select id="editVisibility">' + visOpts + '</select></div>'
    + '<div class="editor-group"><label>内容（支持HTML）</label><textarea id="editContent">' + (art ? art.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '') + '</textarea></div>'
    + '<div style="display:flex;gap:10px;margin-top:16px;">'
    + '<button class="btn-primary" onclick="saveArticle(\'' + (id || '') + '\')">保存</button>'
    + '<button class="btn-sm btn-outline" onclick="closeEditModal()">取消</button></div>';

  document.getElementById('editModal').classList.add('show');
};

window.saveArticle = function(id) {
  const title = document.getElementById('editTitle').value.trim();
  const categoryId = document.getElementById('editCategory').value;
  const visibility = document.getElementById('editVisibility').value;
  const content = document.getElementById('editContent').value
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');

  if (!title) { alert('请填写标题'); return; }
  if (!content) { alert('请填写内容'); return; }

  const now = new Date().toISOString().slice(0, 10);

  if (id) {
    const art = articles.find(a => a.id === id);
    if (art) {
      // 保存旧版本到历史
      history.push({
        time: new Date().toLocaleString('zh-CN'),
        user: currentUser.name,
        action: 'update',
        detail: '更新文章：' + art.title + ' (v' + art.version + ' → v' + (art.version + 1) + ')',
        articleId: art.id,
        oldContent: art.content,
        oldTitle: art.title,
        version: art.version
      });
      art.title = title;
      art.categoryId = categoryId;
      art.visibility = visibility;
      art.content = content;
      art.version++;
      art.updatedAt = now;
      art.updatedBy = currentUser.username;
    }
  } else {
    const newArt = {
      id: 'art_' + Date.now(),
      categoryId, title, visibility, content,
      version: 1, updatedAt: now, updatedBy: currentUser.username
    };
    articles.push(newArt);
    history.push({
      time: new Date().toLocaleString('zh-CN'),
      user: currentUser.name,
      action: 'create',
      detail: '新增文章：' + title,
      articleId: newArt.id,
      version: 1
    });
  }

  persist();
  closeEditModal();
  renderApp();
};

window.deleteArticle = function(id) {
  const art = articles.find(a => a.id === id);
  if (!art || !confirm('确定删除"' + art.title + '"？')) return;
  history.push({
    time: new Date().toLocaleString('zh-CN'),
    user: currentUser.name,
    action: 'delete',
    detail: '删除文章：' + art.title,
    articleId: art.id,
    version: art.version
  });
  articles = articles.filter(a => a.id !== id);
  persist();
  if (currentArticleId === id) { currentPage = 'home'; currentArticleId = null; }
  renderApp();
};

// ===== 版本历史 =====
window.showArticleHistory = function(id) {
  const art = articles.find(a => a.id === id);
  const artHistory = history.filter(h => h.articleId === id).reverse();
  let html = '<div style="font-size:15px;font-weight:600;margin-bottom:16px;">' + (art ? art.title : '已删除') + '</div>';
  if (!artHistory.length) {
    html += '<div style="text-align:center;color:#999;padding:20px;">暂无历史记录</div>';
  } else {
    artHistory.forEach(h => {
      html += '<div class="history-item">'
        + '<div class="history-meta"><span>📅 ' + h.time + '</span><span>👤 ' + h.user + '</span>'
        + '<span class="history-action ' + h.action + '">' + ({create:'新增',update:'更新','delete':'删除'}[h.action] || h.action) + '</span></div>'
        + '<div style="font-size:13px;color:#555;">' + h.detail + '</div>';
      if (h.oldContent) {
        html += '<details style="margin-top:8px;"><summary style="font-size:12px;color:#999;cursor:pointer;">查看旧版内容</summary>'
          + '<div style="background:#f8f8f8;padding:12px;border-radius:6px;margin-top:6px;font-size:13px;max-height:200px;overflow-y:auto;">'
          + h.oldContent + '</div></details>';
      }
      html += '</div>';
    });
  }
  document.getElementById('historyModalBody').innerHTML = html;
  document.getElementById('historyModal').classList.add('show');
};

window.closeHistoryModal = function() { document.getElementById('historyModal').classList.remove('show'); };

// ===== 用户管理 =====
window.openEditUser = function(index) {
  const u = typeof index === 'number' ? users[index] : null;
  const isNew = !u;
  document.getElementById('modalTitle').textContent = isNew ? '新增用户' : '编辑用户';

  let roleOpts = Object.entries(ROLE_LABELS).map(([k,v]) =>
    '<option value="' + k + '"' + (u && u.role === k ? ' selected' : '') + '>' + v + '</option>'
  ).join('');

  document.getElementById('modalBody').innerHTML =
    '<div class="editor-group"><label>用户名</label><input type="text" id="editUsername" value="' + (u ? u.username : '') + '"' + (u ? ' readonly style="background:#f0f0f0;"' : '') + '></div>'
    + '<div class="editor-group"><label>姓名</label><input type="text" id="editName" value="' + (u ? u.name : '') + '"></div>'
    + '<div class="editor-group"><label>密码</label><input type="text" id="editPassword" value="' + (u ? u.password : '') + '"></div>'
    + '<div class="editor-group"><label>角色</label><select id="editRole">' + roleOpts + '</select></div>'
    + '<div style="display:flex;gap:10px;margin-top:16px;">'
    + '<button class="btn-primary" onclick="saveUser(' + (typeof index === 'number' ? index : -1) + ')">保存</button>'
    + '<button class="btn-sm btn-outline" onclick="closeModal()">取消</button></div>';

  document.getElementById('adminModal').classList.add('show');
};

window.saveUser = function(index) {
  const username = document.getElementById('editUsername').value.trim();
  const name = document.getElementById('editName').value.trim();
  const password = document.getElementById('editPassword').value.trim();
  const role = document.getElementById('editRole').value;
  if (!username || !name || !password) { alert('请填写完整信息'); return; }

  if (index >= 0) {
    users[index].name = name;
    users[index].password = password;
    users[index].role = role;
  } else {
    if (users.find(u => u.username === username)) { alert('用户名已存在'); return; }
    users.push({ username, password, role, name });
  }
  persist();
  closeModal();
  renderApp();
};

window.deleteUser = function(index) {
  if (!confirm('确定删除用户"' + users[index].name + '"？')) return;
  users.splice(index, 1);
  persist();
  renderApp();
};

// ===== 弹窗 =====
window.closeModal = function() { document.getElementById('adminModal').classList.remove('show'); };
window.closeEditModal = function() { document.getElementById('editModal').classList.remove('show'); };

// ===== 键盘快捷键 =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal(); closeEditModal(); closeHistoryModal();
  }
});

// ===== 初始化 =====
// 检查 Enter 登录
document.getElementById('loginUser').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doLogin();
});

})();
