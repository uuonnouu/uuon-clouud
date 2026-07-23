#!/usr/bin/env python3
"""
finetune_gpt2.py

Fine-tunes base GPT-2 (openai-community/gpt2) on the JSONL produced by
extract_metadata.py. Saves the fine-tuned model to ./gpt2-uuon-finetuned/

This is intentionally a small, fast, CPU-friendly fine-tune - the goal is
to see whether/how GPT-2's text patterns shift toward UUON vocabulary and
structure, NOT to teach it geometry or mathematical reasoning (a 1.5B
next-token predictor with a 1024-token window cannot meaningfully learn
that from a few hundred examples, and no amount of fine-tuning changes
that ceiling).

Usage:
    python3 finetune_gpt2.py --epochs 3 --model gpt2
    (use --model gpt2-medium / gpt2-large only if you have a GPU; gpt2
    ("small", 124M params) is the right choice for a CPU-only Replit box)
"""

import json
import argparse
from pathlib import Path

from transformers import (
    GPT2LMHeadModel,
    GPT2Tokenizer,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)
from torch.utils.data import Dataset

DATA_DIR = Path(__file__).parent / "data"
JSONL_PATH = DATA_DIR / "training_data.jsonl"
FLAT_TEXT_PATH = DATA_DIR / "training_text.txt"
OUTPUT_MODEL_DIR = Path(__file__).parent / "gpt2-uuon-finetuned"


class ChunkedTextDataset(Dataset):
    """
    Replacement for transformers' removed TextDataset helper.
    Reads the flat text file, tokenizes it, and splits into fixed-size
    block_size chunks for causal LM training - same behavior the old
    helper provided, written explicitly so it doesn't depend on an
    API that no longer exists in current transformers versions.
    """

    def __init__(self, tokenizer, file_path: Path, block_size: int):
        text = file_path.read_text()
        tokenized = tokenizer(text, return_tensors=None)["input_ids"]

        self.examples = []
        for i in range(0, len(tokenized) - block_size + 1, block_size):
            self.examples.append(tokenized[i: i + block_size])

        if not self.examples and tokenized:
            # file shorter than one block - pad with eos so training can still run
            pad_id = tokenizer.eos_token_id
            chunk = tokenized + [pad_id] * (block_size - len(tokenized))
            self.examples.append(chunk[:block_size])

    def __len__(self):
        return len(self.examples)

    def __getitem__(self, idx):
        import torch
        return {"input_ids": torch.tensor(self.examples[idx], dtype=torch.long)}


def flatten_jsonl_to_text(jsonl_path: Path, out_path: Path):
    """
    GPT-2 fine-tuning via causal LM is simplest as flat text blocks.
    Format: "Q: <instruction>\nA: <output>\n\n" repeated, so the model
    learns the instruction -> output association as a text pattern.
    """
    if not jsonl_path.exists():
        raise FileNotFoundError(
            f"{jsonl_path} not found. Run extract_metadata.py first."
        )

    lines = []
    with jsonl_path.open() as f:
        for line in f:
            ex = json.loads(line)
            lines.append(f"Q: {ex['instruction']}\nA: {ex['output']}\n")

    out_path.write_text("\n".join(lines))
    print(f"[flatten] wrote {len(lines)} examples as flat text to {out_path}")
    return len(lines)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="gpt2", help="Base model: gpt2 (124M, recommended for CPU)")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch-size", type=int, default=2)
    parser.add_argument("--block-size", type=int, default=128)
    args = parser.parse_args()

    n_examples = flatten_jsonl_to_text(JSONL_PATH, FLAT_TEXT_PATH)
    if n_examples < 10:
        print(f"\n[warning] Only {n_examples} training examples. Fine-tuning on this "
              f"few examples will mostly just make GPT-2 memorize/echo them verbatim "
              f"rather than generalize. Still useful to demonstrate the before/after "
              f"shift, but don't expect broad pattern learning.\n")

    print(f"[load] tokenizer + base model: {args.model}")
    tokenizer = GPT2Tokenizer.from_pretrained(args.model)
    tokenizer.pad_token = tokenizer.eos_token
    model = GPT2LMHeadModel.from_pretrained(args.model)

    print("[load] building dataset (this tokenizes the flat text file)")
    dataset = ChunkedTextDataset(
        tokenizer=tokenizer,
        file_path=FLAT_TEXT_PATH,
        block_size=args.block_size,
    )
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    training_args = TrainingArguments(
        output_dir=str(OUTPUT_MODEL_DIR / "checkpoints"),
        overwrite_output_dir=True,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        save_strategy="no",
        logging_steps=10,
        report_to=[],
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=dataset,
    )

    print(f"[train] starting fine-tune: {args.epochs} epochs, batch size {args.batch_size}")
    trainer.train()

    OUTPUT_MODEL_DIR.mkdir(exist_ok=True)
    model.save_pretrained(OUTPUT_MODEL_DIR)
    tokenizer.save_pretrained(OUTPUT_MODEL_DIR)
    print(f"\n[done] Fine-tuned model saved to {OUTPUT_MODEL_DIR}")
    print("       Run compare.py next to see base vs. fine-tuned side by side.")


if __name__ == "__main__":
    main()