-- 启用 Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE poster_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE poster_styles ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Articles are publicly readable" ON articles FOR SELECT USING (true);
CREATE POLICY "Skills are publicly readable" ON skills FOR SELECT USING (true);
CREATE POLICY "Knowledge QA are publicly readable" ON knowledge_qa FOR SELECT USING (true);
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

-- 更新时间自动触发器
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