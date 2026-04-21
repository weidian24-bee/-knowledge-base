// ===== 知识库数据层 =====
const DEFAULT_USERS = [
  { username:'admin', password:'admin888', role:'admin', name:'管理员' },
  { username:'trainer', password:'train666', role:'trainer', name:'培训师' },
  { username:'guest', password:'guest123', role:'viewer', name:'查询员' }
];
const ROLE_LABELS = { admin:'管理员', trainer:'日常维护培训师', viewer:'查询浏览' };
const ROLE_PERMS = {
  admin: ['view','edit','delete','manage_users','manage_categories','view_history'],
  trainer: ['view','edit','view_history'],
  viewer: ['view']
};
const DEFAULT_CATEGORIES = [
  { id:'ops', name:'运营管理', icon:'📋', order:1 },
  { id:'aftersale', name:'售后处理', icon:'🔄', order:2 },
  { id:'duty', name:'岗位职责', icon:'👥', order:3 },
  { id:'script', name:'话术模板', icon:'💬', order:4 },
  { id:'flow', name:'流程图解', icon:'📊', order:5 },
  { id:'training', name:'培训考核', icon:'📝', order:6 }
];
// 文章数据 - 从知识文档整理
const DEFAULT_ARTICLES = [
// ========== 运营管理 ==========
{
  id:'art_001', categoryId:'ops', title:'值守团队运营及店长日常工作SOP',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<blockquote>文件目的：规范周黑鸭24小时无人值守门店的夜间运营、突发异常处理及客服接待标准，明确运营岗与值班店长的职责边界与协同流程。<br>适用范围：微店24值守团队运营岗、二线值班店长<br>值守核心目标：实时监控门店状态、规范处理售后需求、拦截店内异常风险。</blockquote>'
  + '<h3>岗位职责与核心使命</h3>'
  + '<ul>'
  + '<li><strong>运营岗职责</strong>：实时监控各门店运营状态，严格按照SOP处理顾客咨询与售后退款；遇到超出权限或复杂情况，第一时间转交二线值班店长跟进，确保问题闭环。</li>'
  + '<li><strong>运营岗使命</strong>：持续巡视店铺动态，以专业、及时的服务响应顾客，敏锐发现店内异常并主动拦截风险。</li>'
  + '<li><strong>值班店长职责</strong>：负责接手运营岗无法处理的升级客诉（如赔偿、重大投诉），协调跑腿关门等突发线下异常，并对整体服务质量兜底。</li>'
  + '</ul>'
  + '<h3>模块一：线上餐道系统与营业状态管理</h3>'
  + '<h4>1. 登录与监控</h4>'
  + '<ul>'
  + '<li>操作步骤：输入账号密码登录系统 → 点击【COMS 6.0】进入主界面。</li>'
  + '<li>邮箱监控：登录公共邮箱，专门用于接收门店状态相关邮件。</li>'
  + '<li><div class="highlight-box"><strong>🚨核心动作</strong>：一旦收到邮件提示店铺状态为"繁忙"，必须<strong>立即</strong>进入餐道系统将状态调整回"营业"。</div></li>'
  + '</ul>'
  + '<h4>2. 营业状态修改步骤</h4>'
  + '<ol><li>进入"门店列表"页面</li><li>输入门店名称或映射码定位门店</li><li>点击右侧"门店营业设置"</li><li>在弹窗中选择"休息"，<strong>随后立即调至"营业"</strong></li></ol>'
  + '<h4>3. 突发闭店处理流程（五步法）</h4>'
  + '<p><strong>触发场景</strong>：商家群内要求闭店；或店铺出现断电断网、黑屏、对讲无声等影响正常值守的设备异常。</p>'
  + '<div class="flow-step"><div class="flow-num">1</div><div class="flow-text"><strong>巡查</strong>：定时巡查问题店铺，确认需要闭店</div></div>'
  + '<div class="flow-step"><div class="flow-num">2</div><div class="flow-text"><strong>通知</strong>：在对应店铺群内发送闭店通知，并做好登记</div></div>'
  + '<div class="flow-step"><div class="flow-num">3</div><div class="flow-text"><strong>联系</strong>：针对店内未取订单，致电顾客致歉并协商取消订单</div></div>'
  + '<div class="flow-step"><div class="flow-num">4</div><div class="flow-text"><strong>恢复</strong>：异常情况解除或商家通知后，打开平台营业状态</div></div>'
  + '<div class="flow-step"><div class="flow-num">5</div><div class="flow-text"><strong>报备</strong>：在门店群内报备已恢复营业</div></div>'
  + '<h3>模块五：高危红线与异常升级机制</h3>'
  + '<h4>🚨 冰箱门未关问题（核心红线）</h4>'
  + '<div class="highlight-box"><strong>风险提示</strong>：未关紧冰箱门将导致冷鲜品失温全部报废，给商家造成重大损失！</div>'
  + '<ul>'
  + '<li><strong>日常提醒</strong>：骑手取货时，通过对讲温和提醒："您拿取冰箱内/保鲜柜里的商品后，请将冰箱门关好。"</li>'
  + '<li><strong>超时应急（升级店长）</strong>：发现冰箱门未关超过30分钟且联系不到人，<strong>立即上报值班店长，呼叫跑腿小哥强制关闭冰箱门</strong>。</li>'
  + '</ul>'
  + '<h4>异常升级流程</h4>'
  + '<p><strong>触发升级条件</strong>：</p>'
  + '<ul><li>顾客情绪激动，常规话术无法安抚</li><li>顾客要求大额赔偿或食品安全维权</li><li>门店突发线下紧急状况（冰箱门长时间未关、门禁损坏、异常人员闯入等）</li><li>系统设备大面积瘫痪无法接单</li></ul>'
  + '<div class="flow-step"><div class="flow-num">1</div><div class="flow-text"><strong>稳住局面</strong>：安抚顾客/骑手，话术："您的问题我已经详细记录，马上为您联系主管处理，请稍等。"</div></div>'
  + '<div class="flow-step"><div class="flow-num">2</div><div class="flow-text"><strong>上报店长</strong>：向二线值班店长汇报三要素（订单号/门店、当前情况、对方诉求）</div></div>'
  + '<div class="flow-step"><div class="flow-num">3</div><div class="flow-text"><strong>协同闭环</strong>：店长接手后处理，运营岗在群内做好日志记录与交接</div></div>'
},
{
  id:'art_002', categoryId:'ops', title:'400客服热线及话术',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<div class="highlight-box"><strong>🚨 红线规定</strong>：400电话接听时间严格为 <strong>21:30 — 次日 09:30</strong>，其余时间必须关机！</div>'
  + '<h3>骑手进线</h3>'
  + '<table><tr><th>场景</th><th>标准话术</th></tr>'
  + '<tr><td>骑手找不到店铺</td><td>您好，请您根据平台提供的导航路线行驶，按照导航指引即可找到店铺位置。</td></tr>'
  + '<tr><td>骑手不取货</td><td>若您无法取货，可在平台操作转单，或者上报相关异常情况，我们会协助处理的。</td></tr>'
  + '<tr><td>骑手询问取货流程</td><td>您扫码进门后，会有客服人员与您对接，他们会指引您完成取货流程的。</td></tr></table>'
  + '<h3>顾客进线</h3>'
  + '<table><tr><th>场景</th><th>标准话术</th></tr>'
  + '<tr><td>顾客询问门店营业时间</td><td>我们门店是全天24小时营业的，随时欢迎您的光临或下单。</td></tr></table>'
},
// ========== 售后处理 ==========
{
  id:'art_003', categoryId:'aftersale', title:'售后处理完善版SOP（核心原则）',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>一、售后处理核心原则</h3>'
  + '<h4>1.1 三大铁律</h4>'
  + '<ol><li><strong>所有同意的退款必须备注"微店"</strong> + 门店群内同步商家</li>'
  + '<li><strong>非值守时段（10:00-20:00）的订单纠纷，夜间暂不处理</strong>，引导次日白班跟进</li>'
  + '<li><strong>先核实订单状态，再做决策</strong> — 避免误判导致商家损失或顾客投诉升级</li></ol>'
  + '<h4>1.2 处理时效要求</h4>'
  + '<table><tr><th>类型</th><th>时效</th></tr>'
  + '<tr><td>退款申请响应</td><td>收到申请后 <strong>15分钟内</strong> 完成审核</td></tr>'
  + '<tr><td>顾客来电/在线咨询</td><td><strong>5分钟内</strong> 给出初步回复</td></tr>'
  + '<tr><td>骑手异常上报</td><td><strong>10分钟内</strong> 核实并处理</td></tr></table>'
  + '<h4>1.3 权限边界</h4>'
  + '<table><tr><th>可直接处理</th><th>需上报班长</th><th>需转白班处理</th></tr>'
  + '<tr><td>单品缺货退款</td><td>整单金额 &gt;200元</td><td>食品安全投诉</td></tr>'
  + '<tr><td>骑手未找到货</td><td>顾客情绪激动威胁投诉</td><td>要求赔偿/补偿</td></tr>'
  + '<tr><td>少送商品（已核实）</td><td>重复退款（同一顾客3次以上）</td><td>变质/异物等质量问题</td></tr>'
  + '<tr><td>顾客主动取消（未配送）</td><td>疑似恶意退款</td><td>要求开发票/收据</td></tr></table>'
},
{
  id:'art_004', categoryId:'aftersale', title:'分阶段售后场景处理手册',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>阶段一：骑手未到店</h3>'
  + '<h4>场景A1：顾客申请退款（商家原因）</h4>'
  + '<div class="flow-step"><div class="flow-num">1</div><div class="flow-text">系统驳回退款申请</div></div>'
  + '<div class="flow-step"><div class="flow-num">2</div><div class="flow-text">发送话术："亲亲您好，您选择的退款原因不太准确哦。如果您不想要了，请重新申请并选择\'我不想要了\'作为退款原因，我们会立即为您处理。"</div></div>'
  + '<div class="info-box">注意：商家原因退款会影响店铺评分，必须驳回并引导顾客更改原因。</div>'
  + '<h4>场景A2：顾客申请退款（顾客原因）</h4>'
  + '<div class="flow-step"><div class="flow-num">1</div><div class="flow-text">系统点击"同意退款"</div></div>'
  + '<div class="flow-step"><div class="flow-num">2</div><div class="flow-text">备注栏填写"微店"</div></div>'
  + '<div class="flow-step"><div class="flow-num">3</div><div class="flow-text">门店群内同步</div></div>'
  + '<h3>阶段二：骑手配送中</h3>'
  + '<h4>场景B1：商家群内未报备，顾客申请退款</h4>'
  + '<p>系统驳回，发送话术引导客服介入（10:00-20:00处理）</p>'
  + '<h4>场景B2：商家群内已报备（缺货、漏装等）</h4>'
  + '<p>核对群内报备信息 → 系统同意退款 → 备注"微店" → 群内回复</p>'
  + '<h4>场景B3：骑手未拿走</h4>'
  + '<p>主动联系顾客致歉 → 引导退款重新下单 → 系统同意 → 群内报备</p>'
  + '<h4>场景B4：长时间未送达（超40分钟）</h4>'
  + '<p>联系骑手询问进度 → 根据反馈分类处理（正常配送/意外/失联）</p>'
  + '<h3>阶段三：骑手到店但未找到货</h3>'
  + '<h4>场景C1：客服主动发起售后（四步处理法）</h4>'
  + '<div class="flow-step"><div class="flow-num">1</div><div class="flow-text">第一时间致电顾客致歉</div></div>'
  + '<div class="flow-step"><div class="flow-num">2</div><div class="flow-text">引导单品退款（仅缺货商品）</div></div>'
  + '<div class="flow-step"><div class="flow-num">3</div><div class="flow-text">系统审核通过，备注"微店"</div></div>'
  + '<div class="flow-step"><div class="flow-num">4</div><div class="flow-text">门店群内同步</div></div>'
  + '<h3>阶段四：订单已送达</h3>'
  + '<table><tr><th>场景</th><th>处理方式</th></tr>'
  + '<tr><td>少送商品（单品退款）</td><td>核实属实 → 同意退款备注"微店"</td></tr>'
  + '<tr><td>整单退款</td><td>驳回，引导客服介入</td></tr>'
  + '<tr><td>部分金额退款</td><td>系统自动驳回</td></tr>'
  + '<tr><td>质量问题（变质/异物）</td><td>驳回，引导保留证据白班处理</td></tr></table>'
},
{
  id:'art_005', categoryId:'aftersale', title:'特殊场景与异常处理',
  visibility:'trainer', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>顾客重复申请退款</h3>'
  + '<ul><li>查看历史退款记录，确认之前处理结果</li>'
  + '<li>之前已驳回的继续驳回，话术保持一致</li>'
  + '<li>连续申请3次以上，上报班长介入</li></ul>'
  + '<h3>疑似恶意退款</h3>'
  + '<div class="warn-box"><strong>识别特征</strong>：同一顾客7天内退款5次以上 / 订单完成多日后突然申请 / 退款理由前后矛盾</div>'
  + '<p>处理：暂不处理，截图保存证据 → 上报班长联系平台风控 → 群内报备</p>'
  + '<h3>顾客威胁投诉/差评</h3>'
  + '<ol><li>保持冷静，不要激化矛盾</li>'
  + '<li>安抚话术："非常理解您的心情...您的问题我已经详细记录，会立即上报给我们的主管..."</li>'
  + '<li>立即上报班长</li><li>门店群内报备</li></ol>'
  + '<h3>骑手投诉/纠纷</h3>'
  + '<ol><li>先安抚骑手情绪，了解具体情况</li>'
  + '<li>能现场解决的立即解决</li>'
  + '<li>无法解决的上报平台</li>'
  + '<li>涉及顾客的及时沟通</li></ol>'
},
{
  id:'art_006', categoryId:'aftersale', title:'顾客安抚与沟通技巧',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>情绪安抚三步法</h3>'
  + '<div class="flow-step"><div class="flow-num">1</div><div class="flow-text"><strong>认同情绪</strong>："我完全理解您的心情" / "换作是我也会很着急"</div></div>'
  + '<div class="flow-step"><div class="flow-num">2</div><div class="flow-text"><strong>承认问题</strong>："这确实是我们的责任" / "给您带来不便真的很抱歉"</div></div>'
  + '<div class="flow-step"><div class="flow-num">3</div><div class="flow-text"><strong>给出方案</strong>："我们会这样处理..." / "建议您..."</div></div>'
  + '<h3>常见顾客异议应对</h3>'
  + '<table><tr><th>异议</th><th>应对话术</th></tr>'
  + '<tr><td>"为什么不能现在退款？"</td><td>非常抱歉，因为我们是夜间托管客服，权限有限。白班客服会优先处理，最晚明天下午给您答复。</td></tr>'
  + '<tr><td>"我要投诉你们！"</td><td>您有权利投诉。但在投诉之前，能否给我们一次解决问题的机会？我已经把您的情况详细记录，明天一定给您满意的答复。</td></tr>'
  + '<tr><td>"我以后再也不买了！"</td><td>真的非常抱歉让您有这样的体验。我们会认真改进，也希望能有机会重新赢得您的信任。</td></tr></table>'
},
// ========== 岗位职责 ==========
{
  id:'art_007', categoryId:'duty', title:'客服与二线专员职责分工',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>整体流程概述</h3>'
  + '<p>本流程涵��从用户咨询到问题解决的完整链路，明确了客服（一线）和二线专员在不同环节的职责边界。</p>'
  + '<h3>客服（一线）职责</h3>'
  + '<h4>接收与初步响应</h4>'
  + '<ul><li>通过各渠道接收用户问题</li><li>快速识别问题属于常见问题还是复杂问题</li></ul>'
  + '<h4>常见问题处理</h4>'
  + '<ul><li>账号登录问题</li><li>基础功能使用指导</li><li>常见报错处理</li><li>标准流程咨询</li></ul>'
  + '<h4>复杂问题识别与转交</h4>'
  + '<p>超出标准处理范围时（技术性故障、系统异常、需要后台操作、涉及数据核查），收集必要信息后创建工单转交二线。</p>'
  + '<h3>二线专员职责</h3>'
  + '<h4>接收工单</h4><p>审核工单，信息不足时联系客服补充。</p>'
  + '<h4>问题分析与处理</h4>'
  + '<ul><li>系统日志查询</li><li>数据库核查</li><li>后台数据修正</li><li>系统配置调整</li></ul>'
  + '<h4>复杂问题升级</h4><p>超出二线处理能力时（系统架构问题、需研发介入），升级至研发/技术团队。</p>'
  + '<h3>协作要点</h3>'
  + '<table><tr><th>角色</th><th>✅ 做什么</th><th>❌ 不做什么</th></tr>'
  + '<tr><td>客服</td><td>快速响应、处理标准化问题、收集完整信息转交、跟进进度</td><td>不擅自承诺技术问题解决时间、不进行后台数据操作</td></tr>'
  + '<tr><td>二线</td><td>深度技术分析、后台操作、知识库建设、反馈结果</td><td>不直接联系用户、不处理常规咨询、不跳过工单流程</td></tr></table>'
  + '<h3>关键流程</h3>'
  + '<p>用户咨询 → 客服接收 → 问题判断</p>'
  + '<ul><li>常见问题 → 客服直接处理 → 反馈用户 → 结束</li>'
  + '<li>复杂问题 → 收集信息 → 创建工单 → 转交二线 → 分析处理 → 反馈客服 → 告知用户</li></ul>'
},
// ========== 话术模板 ==========
{
  id:'art_008', categoryId:'script', title:'退款驳回标准话术库（完整版）',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<table>'
  + '<tr><th>场景分类</th><th>具体情况</th><th>标准话术</th></tr>'
  + '<tr><td>订单状态</td><td>已完成订单退款</td><td>亲亲您好，本店目前客服托管中，无法直接给您退款，请申请客服介入，鸭鸭将在10:00-20:00为您处理。</td></tr>'
  + '<tr><td>订单状态</td><td>骑手已取走退款</td><td>亲亲您好，您的订单骑手已经取走了，无法直接给您退款，如果仍需退款，请申请客服介入。鸭鸭将在10:00-20:00为您处理。</td></tr>'
  + '<tr><td>质量问题</td><td>商品变质/有异物</td><td>亲亲您好，关于商品质量问题我们非常重视，本店目前客服托管中，请申请客服介入并保留商品及照片，鸭鸭将在10:00-20:00为您妥善处理。</td></tr>'
  + '<tr><td>质量问题</td><td>口味不好/不新鲜</td><td>亲亲您好，我们的商品都是当日新鲜制作，如有质量问题请申请客服介入，鸭鸭将在10:00-20:00为您核实处理。</td></tr>'
  + '<tr><td>质量问题</td><td>未收到商品</td><td>亲亲您好，经核实您的订单已完成配送，如有疑问请申请客服介入，鸭鸭将在10:00-20:00为您核实处理。</td></tr>'
  + '<tr><td>营业状态</td><td>商家打烊/未营业</td><td>亲亲您好，目前小店客服托管中，可支持外卖正常取餐和配送，如果不想要了，请选择用户原因申请哦。</td></tr>'
  + '<tr><td>营业状态</td><td>商家缺货/卖完了</td><td>亲亲您好，您要的商品都是有的，会正常给您送，如果不想要了，请选择用户原因申请哦。</td></tr>'
  + '<tr><td>退款原因</td><td>商家原因需改为顾客原因</td><td>亲亲您好，您选择的退款原因不太准确哦。如果您不想要了，请重新申请并选择"我不想要了"作为退款原因，我们会立即为您处理。</td></tr>'
  + '<tr><td>配送问题</td><td>配送超时</td><td>亲亲您好，您的订单正在配送中，可能因路况原因稍有延迟，骑手会尽快送达。如需退款请申请客服介入，鸭鸭将在10:00-20:00为您处理。</td></tr>'
  + '<tr><td>配送问题</td><td>送错地址</td><td>亲亲您好，关于配送地址问题请直接联系骑手或平台客服处理，如需退款请申请客服介入，鸭鸭将在10:00-20:00为您处理。</td></tr>'
  + '</table>'
},
// ========== 流程图解 ==========
{
  id:'art_009', categoryId:'flow', title:'多付场景处理流程',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>场景一：一眼能确认多付（订单重复支付）</h3>'
  + '<div class="flow-step"><div class="flow-num">1</div><div class="flow-text">核对多付订单</div></div>'
  + '<div class="flow-step"><div class="flow-num">2</div><div class="flow-text">操作<strong>退款</strong></div></div>'
  + '<div class="flow-step"><div class="flow-num">3</div><div class="flow-text">编辑话术 → 上报班长</div></div>'
  + '<div class="flow-step"><div class="flow-num">4</div><div class="flow-text">班长同步商家</div></div>'
  + '<h3>场景二：无法确认多付</h3>'
  + '<p>（分配时已多付 / 多件商品不确认 / 二次进店反馈）</p>'
  + '<table><tr><th>😊 顾客愿意等</th><th>😤 顾客不愿意等</th></tr>'
  + '<tr><td>1. 引导顾客离店<br>2. 打标「疑似多付」<br>3. 等待二线处理</td>'
  + '<td>1. 告知转二线处理<br>2. 群内转交二线专员</td></tr></table>'
},
{
  id:'art_010', categoryId:'flow', title:'售后处理检查清单',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>每次处理退款前必查</h3>'
  + '<ul><li>☐ 订单状态是否准确？</li><li>☐ 门店群内是否有相关报备？</li><li>☐ 是否属于值守期间可处理范围？</li><li>☐ 同意退款是否已备注"微店"？</li><li>☐ 是否需要在门店群内同步？</li></ul>'
  + '<h3>每次与顾客沟通后必查</h3>'
  + '<ul><li>☐ 是否安抚了顾客情绪？</li><li>☐ 是否给出了明确的解决方案或时间节点？</li><li>☐ 是否需要上报班长？</li><li>☐ 是否在系统/群内做了记录？</li></ul>'
},
{
  id:'art_011', categoryId:'aftersale', title:'常见问题FAQ',
  visibility:'all', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<table><tr><th>问题</th><th>解答</th></tr>'
  + '<tr><td>顾客说少送了商品，但查不到订单详情？</td><td>先安抚顾客，告知"系统正在查询，请稍等"。然后立即联系班长或技术支持解决系统问题。</td></tr>'
  + '<tr><td>骑手说取不到货，但监控看不清楚？</td><td>通过对讲询问骑手具体位置和订单号，远程指导。如仍无法解决，主动联系顾客致歉并引导退款。</td></tr>'
  + '<tr><td>顾客要求赔偿/补偿？</td><td>夜间值守无权承诺任何补偿，统一话术："您的诉求我已详细记录，会上报主管，明天白班会有专人联系您协商解决方案。"</td></tr>'
  + '<tr><td>同一顾客连续多次退款？</td><td>不能直接拒绝，但需上报班长。按正常流程处理，同时在系统备注"该顾客频繁退款，请关注"。</td></tr>'
  + '<tr><td>门店群内商家说"不同意退款"？</td><td>如果是值守期间可处理的场景，按SOP执行并在群内解释原因。如商家坚持不同意，上报班长协调。</td></tr></table>'
},
// ========== 培训考核 ==========
{
  id:'art_012', categoryId:'training', title:'售后数据记录与复盘要求',
  visibility:'trainer', version:1, updatedAt:'2024-04-20', updatedBy:'admin',
  content: '<h3>每日必记录信息</h3>'
  + '<ul><li>处理退款总数（同意/驳回）</li><li>主动发起售后次数（骑手未找到货等）</li><li>顾客投诉/情绪激动案例</li><li>上报班长的异常订单</li><li>门店设备异常导致的售后</li></ul>'
  + '<h3>交接班重点</h3>'
  + '<ul><li>引导白班处理的订单号及原因</li><li>顾客情绪激动/威胁投诉的案例</li><li>疑似恶意退款的顾客信息</li><li>门店设备异常情况</li></ul>'
  + '<h3>效率提升建议</h3>'
  + '<h4>对客服</h4>'
  + '<ol><li>建立常见问题快速查询手册</li><li>转交工单时信息务必完整</li><li>定期学习二线反馈的典型案例</li></ol>'
  + '<h4>对二线</h4>'
  + '<ol><li>及时更新知识库，减少重复问题</li><li>向客服同步常见问题的处理方法</li><li>建立问题分类标签，提升工单处理效率</li></ol>'
}
];
