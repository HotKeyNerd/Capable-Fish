import sys

def get_greeting(card_type):
    greetings = {
        "birthday": "Happy Birthday! Wishing you a fantastic year ahead.",
        "anniversary": "Happy Anniversary! May your love continue to grow.",
        "thank_you": "Thank you so much! Your kindness is appreciated.",
        "congratulations": "Congratulations! Wishing you all the best.",
        "get_well": "Get well soon! Wishing you a speedy recovery.",
        "sympathy": "With deepest sympathy during your time of loss."
    }
    return greetings.get(card_type.lower(), "Best wishes!")

def main():
    print("Welcome to the Greeting Card Generator!")
    print("Available card types: birthday, anniversary, thank_you, congratulations, get_well, sympathy")
    card_type = input("Enter the type of greeting card: ").strip()
    message = get_greeting(card_type)
    print("\n--- Your Greeting Card ---")
    print(message)

if __name__ == "__main__":
    main()