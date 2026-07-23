#!/usr/bin/env python3
"""
compare.py

Runs identical prompts through BASE GPT-2 and the FINE-TUNED GPT-2,
prints both outputs side by side, and saves the comparison as JSON.

This is the actual "before/after" - the honest scope of what this whole
experiment can show. It demonstrates whether/how fine-tuning shifted
GPT-2's token-prediction patterns toward UUON vocabulary and Q/A structure.
It does NOT demonstrate mathematical understanding, geometric reasoning,
or any kind of "improvement" in capability - GPT-2 is a next-token
predictor with no instruction-following and a 1024-token context window;
nothing here changes that ceiling.
"""

import json
import argparse
from pathlib import Path

from transformers import GPT2LMHeadModel, GPT2Tokenizer, pipeline

FINE_TUNED_DIR = Path(__file__).parent / "gpt2-uuon-finetuned"
RESULTS_PATH = Path(__file__).parent / "data" / "comparison_results.json"

DEFAULT_PROMPTS = [
    "Q: How many shapes are in the 'topology' category of the UUON Δmension API?\nA:",
    "Q: Describe the Quantum Engine in the UUON Δmension API.\nA:",
    "Q: What are the non-zero resolved parameters for the 'klein-bottle' shape?\nA:",
    "Q: What operations does the 'shapes' module support in the Δmension unified SDK?\nA:",
]


def load_pipeline(model_path_or_name):
    tokenizer = GPT2Tokenizer.from_pretrained(model_path_or_name)
    model = GPT2LMHeadModel.from_pretrained(model_path_or_name)
    return pipeline("text-generation", model=model, tokenizer=tokenizer)


def generate(gen_pipeline, prompt, max_new_tokens=40):
    out = gen_pipeline(
        prompt,
        max_new_tokens=max_new_tokens,
        num_return_sequences=1,
        do_sample=True,
        temperature=0.8,
        pad_token_id=gen_pipeline.tokenizer.eos_token_id,
    )
    return out[0]["generated_text"]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-model", default="gpt2")
    parser.add_argument(
        "--prompts-file",
        help="Optional .txt file, one prompt per line, to override DEFAULT_PROMPTS",
    )
    args = parser.parse_args()

    if not FINE_TUNED_DIR.exists():
        raise FileNotFoundError(
            f"{FINE_TUNED_DIR} not found. Run finetune_gpt2.py first."
        )

    prompts = DEFAULT_PROMPTS
    if args.prompts_file:
        prompts = Path(args.prompts_file).read_text().strip().split("\n")

    print(f"[load] base model: {args.base_model}")
    base_gen = load_pipeline(args.base_model)

    print(f"[load] fine-tuned model: {FINE_TUNED_DIR}")
    tuned_gen = load_pipeline(str(FINE_TUNED_DIR))

    results = []
    for prompt in prompts:
        print("\n" + "=" * 80)
        print(f"PROMPT: {prompt}")
        print("-" * 80)

        base_out = generate(base_gen, prompt)
        print(f"[BASE GPT-2]\n{base_out}\n")

        tuned_out = generate(tuned_gen, prompt)
        print(f"[FINE-TUNED GPT-2]\n{tuned_out}\n")

        results.append({
            "prompt": prompt,
            "base_output": base_out,
            "fine_tuned_output": tuned_out,
        })

    RESULTS_PATH.parent.mkdir(exist_ok=True)
    RESULTS_PATH.write_text(json.dumps(results, indent=2))
    print(f"\n[done] Comparison saved to {RESULTS_PATH}")
    print(
        "\nReminder: this shows whether fine-tuning shifted GPT-2's output toward "
        "UUON-specific vocabulary/structure. It is not evidence of mathematical "
        "or geometric understanding - GPT-2 cannot acquire that from fine-tuning."
    )


if __name__ == "__main__":
    main()