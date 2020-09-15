import argparse
import fasttext

parser = argparse.ArgumentParser()
parser.add_argument("-d","--document", type=str, required=True, help="path to documents")
parser.add_argument("-model","--model_name", type=str, default="model.bin", help="outputted model name")
args = parser.parse_args()

with open(args.document, "r") as f:
    terms = f.readlines()

model = fasttext.train_supervised(input=terms)
model.save_model(args.model_name)
