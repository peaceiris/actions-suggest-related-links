import argparse
import numpy as np
import fasttext

parser = argparse.ArgumentParser()
parser.add_argument("-train","--train_document", type=str, required=True, help="path to train document")
parser.add_argument("-test","--test_document", type=str, required=True, help="path to test document")
parser.add_argument("-model","--model_name", type=str, required=True, help="path to model name")
args = parser.parse_args()

pretrained_path = args.model_name
fasttext_model = fasttext.load_model(pretrained_path)

with open(args.train_document) as f:
    trains = f.readlines()

with open(args.test_document) as f:
    test = f.readlines()

def cos_sim(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

for train in trains:
    sent1_emb = np.mean([fasttext_model[x] for word in train.split()[1:] for x in word.split()], axis=0)
    sent2_emb = np.mean([fasttext_model[x] for word in test for x in word.split()], axis=0)
    prob = cos_sim(sent1_emb, sent2_emb)
    print("{}\t{}".format(train.split()[0], prob))
