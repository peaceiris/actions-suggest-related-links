"""
get_issues()
Return type:
github.PaginatedList.PaginatedList of github.Issue.Issue
https://pygithub.readthedocs.io/en/latest/github_objects/Repository.html#github.Repository.Repository.get_issues


class github.Issue.Issue
https://pygithub.readthedocs.io/en/latest/github_objects/Issue.html#issue
"""


from github import Github

with open(".ACCESS_TOKEN", "r") as f:
    token = f.readline()

g = Github(token)
repo = g.get_repo("peaceiris/actions-suggest-related-links")

for issue in repo.get_issues():
    print(issue.body)
    for comment in issue.get_comments():
        print(comment.body)

# print(repo.get_issue(number=7).body)

# For project
"""
repo = g.get_repo("microsoft/TypeScript-Website")
for issue in repo.get_issues():
        print(issue.body)
"""
