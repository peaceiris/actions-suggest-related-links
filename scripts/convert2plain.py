import re
from github import Github
from bs4 import BeautifulSoup
import markdown
import subprocess


with open(".ACCESS_TOKEN", "r") as f:
    token = f.readline()

g = Github(token)
repo = g.get_repo("peaceiris/actions-suggest-related-links")


terms = repo.get_issue(number=10).body
with open("test.txt", "w") as f:
    f.write(terms)

#print(terms)
#print()
#terms = [re.sub('[,.\$()\*|]', '', str(i)) for i in terms]
#print(terms)
#extensions=["toc","attr_list","tables"]
#md = markdown.Markdown(extensions=extensions)
#html = md.convert(terms)
#html = markdown(terms)
#print(html)


with open("test2.txt", "r") as f:
    html = f.readlines()

print(html)
print()
html="\n".join(h for h in html if h)

soup=BeautifulSoup(html,"html.parser")

for script in soup(["script", "style"]):
    script.decompose()
text=soup.get_text()
lines= [line.strip() for line in text.splitlines()]
text="\n".join(line for line in lines if line)
print()
print(text)

text = text.split("\n")
text = " ".join(text)
print(text)
with open("test3.txt", "w") as f:
    f.write(text)

'''
#text = ''.join(BeautifulSoup(html).findAll(text=True))

for term in terms.split("\r\n"):
    term = [re.sub('[,.\$()*|]', '', str(i)) for i in term]
    terms = [i for i in terms if str(i) != '']

    print(term)


comments = repo.get_issue(number=10).get_comments()

for comment in comments:
    for term in comment.body.split("\n"):
        print(term)
'''
