import argparse
import json
import re
import gensim
from gensim import models
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

parser = argparse.ArgumentParser()
parser.add_argument(
    "-i", "--issues", type=str, default="../training_data/issues.json", help="path to issues"
)
parser.add_argument(
    "-c", "--comments", type=str, default="../training_data/comments.json", help="path to comments"
)

args = parser.parse_args()

# load training sentences
issue_open = open(args.issues, "r")
issue_load = json.load(issue_open)
comment_open = open(args.comments, "r")
comment_load = json.load(comment_open)

trains = []
for issue in issue_load:
    if "pull_request" in issue:
        continue
    train = {}
    train["html_url"] = issue["html_url"]
    train["title"] = issue["title"]
    train["body"] = issue["body"]
    trains.append(train)

for comment in comment_load:
    if comment["html_url"].split("/")[-2] == "issues":
        for train in trains:
            if train["html_url"].split("/")[-1] == comment["issue_url"].split("/")[-1]:
                train["body"] = f"{train['body']} {comment['body']}"

# add label
terms = [
    TaggedDocument(f"{train['title']} {train['body']}", [str(i)]) for i, train in enumerate(trains)
]

# model train
model = models.Doc2Vec(terms, dm=0, vector_size=100, window=2, min_count=0, workers=4, epoch=20)
# model.save('doc2vec_model')
model = Doc2Vec.load("doc2vec_model")

# output results
results = model.docvecs.most_similar(len(trains) - 1)

suggestions = []
for result in results:
    index = int(result[0])
    suggestion = {}
    suggestion["html_url"] = trains[index]["html_url"]
    suggestion["title"] = trains[index]["title"]
    suggestion["number"] = int(trains[index]["html_url"].split("/")[-1])
    suggestion["probability"] = result[1]
    suggestions.append(suggestion)

suggestions = json.dumps(suggestions, indent=4)
print(suggestions)
