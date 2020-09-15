import re
from github import Github
from bs4 import BeautifulSoup
import markdown
import subprocess


with open(".ACCESS_TOKEN", "r") as f:
    token = f.readline()

g = Github(token)
#repo = g.get_repo("peaceiris/actions-suggest-related-links")
#repo = g.get_repo("peaceiris/actions-gh-pages")
repo = g.get_repo("microsoft/TypeScript")

for issue in repo.get_issues(state="all"):
    if issue.pull_request is not None:
        continue
    label_count = issue.number
    terms = issue.body
    with open("markdown.txt","w") as f:
        f.write(terms)
    cmd = ["ruby", "-rgithub/markup", "-e", "puts GitHub::Markup.render('README.md', File.read('markdown.txt'))"]
    convert = subprocess.run(cmd, encoding='utf-8', stdout=subprocess.PIPE)
    html = convert.stdout
    soup=BeautifulSoup(html,"html.parser")
    for script in soup(["script", "style"]):
        script.decompose()
    text=soup.get_text()
    lines= [line.strip() for line in text.splitlines()]
    text="\n".join(line for line in lines if line)
    text = text.split("\n")
    text = " ".join(text)
    with open("train_body.txt", "a") as f:
        f.write("__label__{} {}\n".format(label_count, text))






"""
comments = repo.get_issue(number=10).get_comments()

for comment in comments:
    for term in comment.body.split("\n"):
        print(term)
"""
