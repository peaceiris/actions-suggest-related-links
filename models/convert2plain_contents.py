import re
from github import Github
from bs4 import BeautifulSoup
import markdown
import subprocess
import base64

with open(".ACCESS_TOKEN", "r") as f:
    token = f.readline()

g = Github(token)
#repo = g.get_repo("peaceiris/actions-suggest-related-links")
#repo = g.get_repo("peaceiris/actions-gh-pages")
repo = g.get_repo("microsoft/TypeScript")

contents = repo.get_contents("")

while contents:
    file_content = contents.pop(0)
    if file_content.type == "dir":
        contents.extend(repo.get_contents(file_content.path))

    else:
        if file_content.path.endswith(".md"):
            terms = base64.b64decode(file_content.content).decode(encoding="utf-8")
            label_name = file_content.path
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
            with open("train_contents.txt", "a") as f:
                f.write("{} {}\n".format(label_name, text))
