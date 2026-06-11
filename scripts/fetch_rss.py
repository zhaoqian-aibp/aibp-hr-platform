#!/usr/bin/env python3
"""Fetch HR-related articles from RSS feeds and generate articles.json"""

import json
import feedparser
import re
from bs4 import BeautifulSoup
from datetime import datetime

# RSS sources - 36kr has a working RSS, others can be added
RSS_SOURCES = [
    {
        "url": "https://36kr.com/feed",
        "source": "36氪",
        "hr_keywords": ["HR", "人力", "招聘", "薪酬", "绩效", "组织", "人才", "培训", "面试",
                         "职场", "员工", "管理", "领导", "团队", "文化", "BP", "大模型", "AI",
                         "互联网", "科技", "创业", "公司", "裁员", "优化", "合并", "调整"]
    }
]

def clean_html(text):
    """Remove HTML tags and clean up text"""
    if not text:
        return ""
    soup = BeautifulSoup(text, 'html.parser')
    return soup.get_text(strip=True)[:300]  # Truncate to 300 chars

def is_hr_related(title, summary, keywords):
    """Check if article is HR-related"""
    text = (title + " " + summary).lower()
    return any(kw.lower() in text for kw in keywords)

def fetch_feed(source_config):
    """Fetch and parse RSS feed"""
    articles = []
    feed = feedparser.parse(source_config["url"])
    
    for entry in feed.entries[:30]:
        title = entry.get("title", "")
        summary = clean_html(entry.get("summary", entry.get("description", "")))
        link = entry.get("link", "")
        pub_date = entry.get("published", entry.get("updated", ""))
        
        # Determine category
        category = "行业动态"
        title_lower = title.lower()
        if any(kw in title_lower for kw in ["ai", "大模型", "gpt", "llm", "智能"]):
            category = "AI+HR"
        elif any(kw in title_lower for kw in ["薪酬", "工资", "薪资", "涨薪"]):
            category = "薪酬趋势"
        elif any(kw in title_lower for kw in ["组织", "架构", "合并", "调整", "裁员"]):
            category = "组织管理"
        elif any(kw in title_lower for kw in ["招聘", "面试", "校招", "人才"]):
            category = "人才招聘"
        elif any(kw in title_lower for kw in ["培训", "学习", "成长"]):
            category = "人才发展"
        
        read_time = max(3, len(summary) // 100)  # Estimate read time
        
        articles.append({
            "id": link.split("/")[-1].split("?")[0] if link else str(hash(title)),
            "title": title,
            "summary": summary,
            "category": category,
            "source": source_config["source"],
            "url": link,
            "read_time": f"{read_time}min",
            "date": pub_date[:10] if pub_date else datetime.now().strftime("%Y-%m-%d"),
            "full_content": clean_html(entry.get("summary", entry.get("description", "")))
        })
    
    return articles

def main():
    all_articles = []
    
    for source in RSS_SOURCES:
        try:
            articles = fetch_feed(source)
            # Filter HR-related articles
            hr_articles = [a for a in articles if is_hr_related(a["title"], a["summary"], source["hr_keywords"])]
            # If too few HR articles, include all (general industry news)
            if len(hr_articles) < 5:
                hr_articles = articles[:15]
            all_articles.extend(hr_articles)
            print(f"Fetched {len(articles)} from {source['source']}, {len(hr_articles)} HR-related")
        except Exception as e:
            print(f"Error fetching {source['url']}: {e}")
    
    # Sort by date (newest first)
    all_articles.sort(key=lambda x: x.get("date", ""), reverse=True)
    
    # Keep max 50 articles
    all_articles = all_articles[:50]
    
    # Save
    output = {
        "last_updated": datetime.now().isoformat(),
        "total": len(all_articles),
        "articles": all_articles
    }
    
    with open("data/articles.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"Total articles saved: {len(all_articles)}")

if __name__ == "__main__":
    main()
