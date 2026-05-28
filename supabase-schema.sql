-- ============================================
-- AIBP HR Platform - Database Schema
-- ============================================

-- 1. 情报文章表
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('政策解读', '工具评测', '行业案例', '学术前沿', '招聘趋势', '薪酬动态')),
  source TEXT NOT NULL,
  source_url TEXT,
  read_time TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 技能表
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('招聘', '培训', '绩效', '薪酬', '员工关系', '组织发展', '数据分析')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('入门', '进阶', '高级')),
  tags TEXT[] DEFAULT '{}',
  installs INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  icon_url TEXT,
  skill_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 知识问答表
CREATE TABLE knowledge_qa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('劳动合同', '绩效管理', '薪酬福利', '招聘录用', '培训发展', '员工关系', '合规风控')),
  source TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 海报类型表
CREATE TABLE poster_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 海报风格表
CREATE TABLE poster_styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 用户表（Supabase Auth 自带 auth.users，这里做扩展）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  invitation_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 邀请码表
CREATE TABLE invitation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 用户收藏表
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  article_id UUID REFERENCES articles(id),
  skill_id UUID REFERENCES skills(id),
  qa_id UUID REFERENCES knowledge_qa(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 插入初始数据
-- ============================================

-- 情报文章初始数据
INSERT INTO articles (title, summary, category, source, read_time, tags) VALUES
('2026年人力资源数字化转型五大趋势', '从AI招聘到智能绩效，HR领域正在经历一场静默的变革。本文梳理了当前最值得关注的五个技术方向。', '行业案例', 'HR Tech Weekly', '8分钟', ARRAY['数字化转型', 'AI招聘', '趋势']),
('《个人信息保护法》最新修订对HR数据处理的影响', '新修订条款对员工数据的收集、存储和跨境传输提出了更严格的要求，HR需要重新审视数据合规流程。', '政策解读', '劳动法律观察', '6分钟', ARRAY['数据合规', '个人信息保护法', '隐私']),
('ChatGPT vs Claude vs 通义千问：HR场景实测对比', '我们用50道HR专业问题测试了三大主流LLM，发现不同模型在招聘JD生成、绩效评语撰写等场景上各有优劣。', '工具评测', 'AIBP评测团队', '12分钟', ARRAY['LLM对比', '招聘JD', '绩效评语']),
('OKR与KPI融合实践：某科技公司绩效管理改革纪实', '一家2000人规模科技公司如何在保留KPI考核框架的同时引入OKR敏捷目标管理，实现绩效体系的双轨进化。', '行业案例', '组织发展周刊', '10分钟', ARRAY['OKR', 'KPI', '绩效管理']),
('AI辅助简历筛选：准确率提升了多少？', '基于三家企业的实际数据，AI简历筛选工具的初筛准确率平均提升了23%，但误判风险仍需人工复核兜底。', '学术前沿', 'HR Research Lab', '15分钟', ARRAY['简历筛选', 'AI准确率', '招聘']),
('2026年Q1全国主要城市薪酬涨幅排行', '深圳、杭州、成都位列薪酬涨幅前三，半导体和新能源行业薪资增速领跑全行业。', '薪酬动态', '薪酬情报局', '5分钟', ARRAY['薪酬涨幅', '城市排行', '行业薪酬']);

-- 技能初始数据
INSERT INTO skills (name, description, category, difficulty, tags, installs, rating) VALUES
('智能JD生成器', '基于岗位要求自动生成标准化招聘JD，支持多语言、多风格输出，一键调整语气和细节。', '招聘', '入门', ARRAY['JD生成', '招聘文案', '多语言'], 1200, 4.80),
('简历智能筛选', 'AI驱动的简历初筛工具，根据JD关键词自动匹配和排序候选人简历，减少50%初筛时间。', '招聘', '入门', ARRAY['简历筛选', '候选人匹配', '效率提升'], 856, 4.60),
('培训需求诊断', '基于绩效数据和员工画像自动识别培训需求缺口，生成个性化培训计划建议。', '培训', '进阶', ARRAY['培训需求', '能力差距', '个性化'], 432, 4.50),
('绩效评语助手', '根据绩效数据自动生成专业、客观、建设性的绩效评语，避免主观偏见和措辞不当。', '绩效', '入门', ARRAY['绩效评语', '客观评价', '偏见消除'], 678, 4.70),
('薪酬竞争力分析', '输入岗位和城市，自动对比市场薪酬水平，生成薪酬竞争力报告和调薪建议。', '薪酬', '进阶', ARRAY['薪酬对标', '市场分析', '调薪建议'], 342, 4.40),
('员工离职预警', '基于行为数据（考勤、参与度、满意度）预测离职风险，提前识别高离职倾向员工。', '员工关系', '高级', ARRAY['离职预测', '风险预警', '人才保留'], 567, 4.30),
('组织健康度诊断', '多维度评估组织效能（结构、流程、文化、人才），生成可视化诊断报告和改进建议。', '组织发展', '高级', ARRAY['组织诊断', '效能评估', '改进建议'], 234, 4.20),
('HR数据看板构建', '一键生成HR核心指标看板（HC、离职率、人均效能），支持自定义维度和对比分析。', '数据分析', '进阶', ARRAY['数据看板', 'HC分析', '效能指标'], 789, 4.90);

-- 知识问答初始数据
INSERT INTO knowledge_qa (question, answer, category, source, likes) VALUES
('试用期不合格可以随时辞退吗？', '不可以。试用期辞退仍需证明员工"不符合录用条件"，需要：①入职时明确约定录用条件；②有客观证据证明不符合；③在试用期内做出决定。否则可能构成违法解除，需支付赔偿金。', '劳动合同', '劳动合同法第21条 + 最高人民法院司法解释', 234),
('绩效评级强制分布（271）是否合法？', '强制分布本身不违法，但若因此直接降薪或解除合同则存在法律风险。关键在于：①绩效制度需经过民主程序制定并公示；②评级标准需客观合理，不能仅凭主观判断；③末位≠不胜任，不能简单以排名末位为由解除合同。', '绩效管理', '劳动合同法第4条 + 最高人民法院指导案例18号', 189),
('员工主动离职需要公司批准吗？', '不需要。员工提前30日以书面形式通知用人单位即可解除合同（试用期提前3日），这是劳动法赋予的单方权利，无需公司"批准"或"同意"。公司只能确认收到通知，不能拒绝。', '劳动合同', '劳动合同法第37条', 456),
('年终奖是否必须发放？', '取决于制度约定：①若公司规章制度或劳动合同明确约定了年终奖发放条件和标准，则必须按约定执行；②若仅为"惯例"而无明确制度，公司有自主决定权；③已发放的年终奖不能以"业绩不好"为由要求员工退还。', '薪酬福利', '劳动法第47条 + 各地法院判例', 312),
('背调发现简历造假，已入职怎么办？', '分情况处理：①若造假涉及学历、工作经历等核心信息，且入职时签署了真实性承诺，可依据"欺诈"主张合同无效，无需支付经济补偿；②若造假属于非核心信息（如薪资微调），建议先沟通再决定处理方式；③需保留造假证据和真实性承诺文件。', '招聘录用', '劳动合同法第26条 + 第39条', 278),
('培训费用可以要求员工赔偿吗？', '只有"专项培训"（非日常岗位培训）才可以约定服务期和违约金。条件：①必须是专业技术培训，有明确培训内容；②公司实际支付了培训费用（有发票等凭证）；③双方签订了服务期协议；④违约金不得超过培训费用未履行部分。', '培训发展', '劳动合同法第22条', 167),
('员工孕期绩效差可以降薪吗？', '不可以。孕期、产期、哺乳期女职工受特殊保护：①不能因怀孕降低工资；②不能以"不胜任工作"为由解除合同；③确有绩效问题应先调整岗位（而非降薪），且调整后工资不得降低。违法操作可能面临双倍赔偿。', '员工关系', '女职工劳动保护特别规定第5条 + 劳动合同法第42条', 523),
('远程办公员工的考勤怎么管？', '建议建立"弹性+底线"机制：①明确核心工作时间（如10:00-16:00在线）；②以产出而非在线时长衡量工作成果；③使用协同工具的活跃数据替代传统打卡；④定期1on1确认工作进度和困难。切忌简单照搬线下考勤制度。', '合规风控', 'HR最佳实践 + 2024远程办公白皮书', 145);

-- 海报类型初始数据
INSERT INTO poster_types (name, label, description, icon, sort_order) VALUES
('referral', '📢 内推海报', '招聘岗位内推宣传', 'megaphone', 1),
('training', '🎓 培训海报', '培训课程宣传', 'graduation-cap', 2),
('event', '🎉 活动海报', '公司活动宣传', 'party-popper', 3),
('festival', '🎊 节日海报', '节日祝福海报', 'sparkles', 4),
('notice', '📋 通知公告', '政策/制度通知', 'clipboard', 5);

-- 海报风格初始数据
INSERT INTO poster_styles (name, label, color, sort_order) VALUES
('modern', '现代简约', '#2E5C55', 1),
('game', '游戏潮流', '#6C63FF', 2),
('tech', '科技感', '#00B4D8', 3),
('warm', '温暖人文', '#FF8A65', 4),
('chinese', '国风', '#C41E3A', 5);

-- ============================================
-- 启用 Row Level Security（RLS）
-- ============================================

-- 公开读取策略（所有用户可浏览内容）
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE poster_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE poster_styles ENABLE ROW LEVEL SECURITY;

-- 情报文章：所有人可读
CREATE POLICY "Articles are publicly readable" ON articles FOR SELECT USING (true);

-- 技能：所有人可读
CREATE POLICY "Skills are publicly readable" ON skills FOR SELECT USING (true);

-- 知识问答：所有人可读
CREATE POLICY "Knowledge QA are publicly readable" ON knowledge_qa FOR SELECT USING (true);

-- 海报类型/风格：所有人可读
CREATE POLICY "Poster types are publicly readable" ON poster_types FOR SELECT USING (true);
CREATE POLICY "Poster styles are publicly readable" ON poster_styles FOR SELECT USING (true);

-- 用户资料：仅本人可读写
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 收藏：仅本人可读写
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- 邀请码：管理员可读写
ALTER TABLE invitation_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Invitation codes are admin only" ON invitation_codes FOR ALL USING (false);

-- ============================================
-- 更新时间自动触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER knowledge_qa_updated_at BEFORE UPDATE ON knowledge_qa FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();