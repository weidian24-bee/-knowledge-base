#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Try to register Chinese fonts
font_paths = [
    ('/System/Library/Fonts/STHeiti Medium.ttc', 'STHeiti'),
    ('/System/Library/Fonts/PingFang.ttc', 'PingFang'),
    ('/System/Library/Fonts/Supplemental/Songti.ttc', 'Songti'),
    ('/Library/Fonts/Arial Unicode.ttf', 'ArialUnicode'),
    ('/System/Library/Fonts/Helvetica.ttc', 'Helvetica'),
]

cn_font = 'Helvetica'
cn_font_bold = 'Helvetica-Bold'

for fpath, fname in font_paths:
    if os.path.exists(fpath):
        try:
            pdfmetrics.registerFont(TTFont(fname, fpath, subfontIndex=0))
            cn_font = fname
            cn_font_bold = fname  # ttc fonts handle bold internally
            print(f"Using font: {fname}")
            break
        except Exception as e:
            print(f"Failed {fname}: {e}")
            continue

outpath = '/Users/weidian/openclaw-portable/config/workspace-bot1-agent/media/outbound/AI培训复盘总结.pdf'

doc = SimpleDocTemplate(
    outpath,
    pagesize=A4,
    leftMargin=25*mm,
    rightMargin=25*mm,
    topMargin=20*mm,
    bottomMargin=20*mm
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'CNTitle',
    parent=styles['Title'],
    fontName=cn_font,
    fontSize=18,
    leading=24,
    alignment=TA_CENTER,
    spaceAfter=6,
)

subtitle_style = ParagraphStyle(
    'CNSubtitle',
    parent=styles['Normal'],
    fontName=cn_font,
    fontSize=11,
    leading=16,
    alignment=TA_CENTER,
    textColor=colors.grey,
    spaceAfter=12,
)

heading1_style = ParagraphStyle(
    'CNH1',
    parent=styles['Heading1'],
    fontName=cn_font,
    fontSize=15,
    leading=22,
    spaceBefore=16,
    spaceAfter=8,
    textColor=colors.HexColor('#1a1a1a'),
)

heading2_style = ParagraphStyle(
    'CNH2',
    parent=styles['Heading2'],
    fontName=cn_font,
    fontSize=12,
    leading=18,
    spaceBefore=12,
    spaceAfter=6,
    textColor=colors.HexColor('#333333'),
)

bullet_style = ParagraphStyle(
    'CNBullet',
    parent=styles['Normal'],
    fontName=cn_font,
    fontSize=10.5,
    leading=16,
    leftIndent=18,
    spaceBefore=3,
    spaceAfter=3,
)

sub_bullet_style = ParagraphStyle(
    'CNSubBullet',
    parent=styles['Normal'],
    fontName=cn_font,
    fontSize=10,
    leading=15,
    leftIndent=36,
    spaceBefore=2,
    spaceAfter=2,
    textColor=colors.HexColor('#444444'),
)

label_style = ParagraphStyle(
    'CNLabel',
    parent=styles['Normal'],
    fontName=cn_font,
    fontSize=11,
    leading=16,
    spaceBefore=6,
    spaceAfter=4,
)

story = []

# Title
story.append(Paragraph('AI培训复盘总结', title_style))
story.append(Spacer(1, 4*mm))

# Subtitle block - matching 美邻友 format
story.append(Paragraph('复盘记录：', label_style))
story.append(Paragraph('AI培训复盘', label_style))
story.append(Paragraph('怎么干的、干成什么样、为什么这么干', label_style))
story.append(Paragraph('给谁讲、讲什么、怎么讲', label_style))
story.append(Spacer(1, 6*mm))

# ===== 一、核心问题诊断 =====
story.append(Paragraph('一、核心问题诊断', heading1_style))

story.append(Paragraph('1. 准备阶段：培训前检查与知识储备不足', heading2_style))
for item in [
    '<b>设备检查疏漏：</b> 误以为麦克风、摄像头已开启，实际未开启，导致培训开场信息传递失败，影响学员第一印象。',
    '<b>专业知识储备不扎实：</b> 对AI客服相关知识点掌握不够熟练，讲解时底气不足，难以应对学员提问。',
    '<b>培训重点未提前梳理：</b> 未明确哪些是核心内容（如快捷键等实操要点），导致讲解时主次不分。',
    '<b>学员背景了解不足：</b> 未针对新同事的认知水平提前设计讲解深度与节奏。',
]:
    story.append(Paragraph('●  ' + item, bullet_style))

story.append(Paragraph('2. 执行阶段：节奏与专业度不足', heading2_style))
for item in [
    '<b>进度过快：</b> 整体节奏拉得太快，学员来不及消化，重点部分一带而过。',
    '<b>讲解颗粒度粗：</b> 快捷键等实操细节没有细致展开，学员难以落地使用。',
    '<b>互动反馈缺失：</b> 未及时确认学员是否跟上，缺少答疑环节。',
]:
    story.append(Paragraph('●  ' + item, bullet_style))

story.append(Paragraph('3. 后续跟进：闭环管理缺失', heading2_style))
for item in [
    '<b>学习效果未验证：</b> 培训结束后没有通过考核或实操检验学员掌握情况。',
    '<b>待入职同事跟进不到位：</b> 对已培训但尚未入职的同事缺少持续跟进，容易出现信息断层或流失。',
]:
    story.append(Paragraph('●  ' + item, bullet_style))

# ===== 二、提升方向与行动方案 =====
story.append(Paragraph('二、提升方向与行动方案', heading1_style))

story.append(Paragraph('1. 前期准备流程', heading2_style))
for item in [
    '<b>设备检查清单化：</b> 培训开始前5分钟完成"麦克风/摄像头/屏幕共享/网络"四项测试，并在群内发一句试音确认。',
    '<b>知识预习机制：</b> 培训前自己先把AI客服知识点过一遍——只有自己懂了，才能讲明白。对不熟的点提前查证，避免现场"卡壳"。',
    '<b>培训大纲与重点标记：</b> 提前列出培训目录，标注"重点/难点/必会"，让学员心里有地图。',
    '<b>学员信息同步：</b> 提前了解新同事的岗位、基础、入职时间，有针对性地调整讲解深度。',
]:
    story.append(Paragraph('●  ' + item, bullet_style))

story.append(Paragraph('2. 塑造专业、清晰的讲解形象', heading2_style))
story.append(Paragraph('●  <b>内容标准化与"去专业化"</b>', bullet_style))
story.append(Paragraph('●  <b>业务介绍逻辑：</b> AI客服业务模式 → 基础操作流程 → 所需工具/快捷键。避免顺序颠倒。', bullet_style))
story.append(Paragraph('●  <b>表述方式打磨：</b> 将复杂专业词汇转化为通俗易懂的比喻或案例。', bullet_style))
story.append(Paragraph('●  <b>强化控场与互动技巧培训</b>', bullet_style))
story.append(Paragraph('●  <b>节奏控制：</b> 为每个环节设定时间节点（如：业务介绍15分钟/快捷键演示20分钟/答疑10分钟）。', bullet_style))
story.append(Paragraph('●  <b>氛围调动：</b> 设计1-2个互动问答或小练习，避免单向灌输。', bullet_style))
story.append(Paragraph('●  <b>自信表达：</b> 进行内部模拟演练，重点内容放慢——讲一遍→演示一遍→让学员跟做一遍。', bullet_style))

story.append(Paragraph('3. 深入知识内核，做价值输出', heading2_style))
story.append(Paragraph('●  <b>AI客服专业知识沉淀：</b>', bullet_style))
story.append(Paragraph('○  建立自己的"知识储备清单"，把常见问题、易错点、业务逻辑整理成文档，每次培训前刷一遍。', sub_bullet_style))
story.append(Paragraph('○  遇到回答不上的问题，事后复盘并补充进知识库。', sub_bullet_style))
story.append(Paragraph('●  <b>快捷键实操手册化：</b>', bullet_style))
story.append(Paragraph('○  整理一份《AI客服常用快捷键速查表》，培训后发给学员，方便日常查阅。', sub_bullet_style))
story.append(Paragraph('○  不只念快捷键，还要讲"什么场景下用→按哪几个键→实际效果"三件套。', sub_bullet_style))
story.append(Paragraph('○  现场演示+截图/录屏留档，方便学员回看。', sub_bullet_style))
story.append(Paragraph('●  <b>培训复用：</b> 每次培训后沉淀课件，下次直接迭代升级，避免重复造轮子。', bullet_style))

story.append(Paragraph('4. 培训后跟进闭环', heading2_style))
story.append(Paragraph('●  <b>考核验收：</b> 培训结束安排简短测试或实操，确认学员掌握情况，薄弱点再单独辅导。', bullet_style))
story.append(Paragraph('●  <b>待入职同事跟进机制：</b>', bullet_style))
story.append(Paragraph('○  建立跟进表：姓名/入职状态/最近联系时间/下次跟进时间。', sub_bullet_style))
story.append(Paragraph('○  每周固定时间@一次，保持连接，降低流失风险。', sub_bullet_style))
story.append(Paragraph('●  <b>培训效果回访：</b> 入职后1周、1个月回访一次，听学员反馈哪些讲得不够清楚，反哺下一次培训。', bullet_style))

doc.build(story)
print(f'PDF saved: {outpath}')
