import re
import gensim
from gensim import models
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

# open training sentences
with open("train.txt", "r") as f:
    terms = f.readlines()

def remove_non_alphabet(terms):
    terms = [i for i in terms if str(i).isdecimal() == False]
    terms = [re.sub('[:,.\$()]', '', str(i)) for i in terms]
    terms = [re.sub('^-$', '', str(i)) for i in terms]
    terms = [i.replace('"', '') for i in terms]
    terms = [i for i in terms if str(i) != '']

    return terms

def remove_words(terms, stop_words):
    terms = [[word for word in term.lower().split() if word not in stop_words] for term in terms]
    return terms

# get labels
labels = [term.split()[0] for term in terms]

# define stop words
stop_words = set('for a of the and to in'.split())

# preprocessing
terms = [term.split()[1:] for term in terms]
terms = [" ".join(term) for term in terms]
terms = remove_words(terms, stop_words)
terms = remove_non_alphabet(terms)
terms = [TaggedDocument(doc, [labels[i]]) for i, doc in enumerate(terms)]

# generate model
model = models.Doc2Vec(terms, dm=0, vector_size=100, window=2, min_count=0, workers=4, epoch=10)

# output results
results = model.docvecs.most_similar('__label__31')
for result in results:
    print(result)
