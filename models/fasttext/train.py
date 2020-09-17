import argparse
import fasttext
import json
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument("-d","--documents", type=str, default='../training_data/training-data.json', help="path to documents")
parser.add_argument("-train","--train_document", type=str, default='./train.txt', help="path to train document")
parser.add_argument("-test","--test_document", type=str, default='./test.txt', help="path to test document")
args = parser.parse_args()

def cos_sim(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

# load train data
issues_open = open(args.documents, "r")
issues_load = json.load(issues_open)

# load test data
with open(args.test_document) as f:
    test = f.readlines()

# add label
terms = ''
label_num = 0
for issue in issues_load:
    if issue['html_url'].split('/')[-2] == 'issues':
        terms += f"__label__{issue['number']} {issue['body']}\n"
        label_num += 1

with open(args.train_document, 'w') as f:
    f.write(terms)

# train model
with open(args.train_document) as f:
    trains = f.readlines()
model = fasttext.train_supervised(input=args.train_document)

# test model
test_word_vector = np.mean([model[x] for word in test for x in word.split()], axis=0)
results = []
for train in trains:
    result = {}
    train_word_vector = np.mean([model[x] for word in train.split()[1:] for x in word.split()], axis=0)
    prob = cos_sim(train_word_vector, test_word_vector)
    result['probability'] = prob
    result['label'] = train.split()[0]
    results.append(result)

results = sorted(results, key=lambda x:x['probability'], reverse=True)
suggestions = []

for result in results:
    for issue in issues_load:
        if issue['number'] == int(result['label'].split('__')[-1]):
            suggestion = {}
            suggestion['html_url'] = issue['html_url']
            suggestion['title'] = issue['title']
            suggestion['number'] = int(issue['html_url'].split('/')[-1])
            suggestion['probability'] = float(result['probability'])
            suggestions.append(suggestion)

suggestions = json.dumps(suggestions, indent=4)
with open('suggestions.json', 'w') as f:
    f.write(suggestions)

print(suggestions)
