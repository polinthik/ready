import random
import string
import sys

class PasswordManager:
    def __init__(self):
        # Распространённые слабые пароли (в нижнем регистре)
        self.common_passwords = {
            'password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon',
            'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123',
            'mustang', 'michael', 'shadow', 'master', 'jennifer', '111111',
            '2000', 'jordan', 'superman', 'harley', '1234567', 'fuckyou',
            'hunter', 'trustno1', 'ranger', 'buster', 'thomas', 'tigger',
            'robert', 'soccer', 'batman', 'test', 'pass', 'hello', 'admin',
            'welcome', 'qwerty123', '123qwe', '1q2w3e', 'q1w2e3', 'password123'
        }
        
        # Наборы символов
        self.upper = string.ascii_uppercase
        self.lower = string.ascii_lowercase
        self.digits = string.digits
        self.special = "!@#$%^&*()_+=-{}[]:;\"'<>,.?/|\\~"
    
    def get_yes_no(self, prompt):
        """Запрос ответа да/нет с обработкой ошибок"""
        while True:
            answer = input(prompt).strip().lower()
            if answer in ['да', 'yes', 'y', 'д', '+']:
                return True
            elif answer in ['нет', 'no', 'n', 'н', '-']:
                return False
            else:
                print("Ошибка: введите 'да' или 'нет'")
    
    def get_password_length(self):
        """Запрос длины пароля с проверкой"""
        while True:
            try:
                length = int(input("Введите длину пароля (от 4 до 64): "))
                if 4 <= length <= 64:
                    return length
                else:
                    print("Ошибка: длина должна быть от 4 до 64 символов")
            except ValueError:
                print("Ошибка: введите целое число")
    
    def generate_password(self):
        """Генерация пароля по заданным критериям"""
        print("\n" + "="*50)
        print("ГЕНЕРАЦИЯ ПАРОЛЯ")
        print("="*50 + "\n")
        
        # Получение параметров
        length = self.get_password_length()
        use_upper = self.get_yes_no("Включать прописные буквы (A-Z)? (да/нет): ")
        use_lower = self.get_yes_no("Включать строчные буквы (a-z)? (да/нет): ")
        use_digits = self.get_yes_no("Включать цифры (0-9)? (да/нет): ")
        use_special = self.get_yes_no("Включать специальные символы (!@#$%^&*()_+)? (да/нет): ")
        
        # Проверка: выбрана хотя бы одна категория
        if not (use_upper or use_lower or use_digits or use_special):
            print("\nОшибка: необходимо выбрать хотя бы одну категорию символов!\n")
            return
        
        # Формирование наборов символов
        char_sets = []
        if use_upper:
            char_sets.append(self.upper)
        if use_lower:
            char_sets.append(self.lower)
        if use_digits:
            char_sets.append(self.digits)
        if use_special:
            char_sets.append(self.special)
        
        # Формирование общего набора символов
        all_chars = ''.join(char_sets)
        
        # Гарантируем хотя бы один символ из каждой выбранной категории
        password_chars = []
        for char_set in char_sets:
            password_chars.append(random.choice(char_set))
        
        # Добираем остальные символы
        for _ in range(length - len(password_chars)):
            password_chars.append(random.choice(all_chars))
        
        # Перемешиваем символы
        random.shuffle(password_chars)
        
        # Формируем пароль
        password = ''.join(password_chars)
        
        print("\n" + "="*50)
        print(f"Сгенерированный пароль: {password}")
        print("="*50 + "\n")
    
    def check_password_strength(self, password):
        """Проверка надёжности пароля"""
        score = 0
        feedback = []
        
        # Проверка длины
        length = len(password)
        if length >= 12:
            score += 2
            feedback.append(f"✓ Отличная длина ({length} символов)")
        elif length >= 8:
            score += 1
            feedback.append(f"✓ Хорошая длина ({length} символов)")
        else:
            feedback.append(f"✗ Недостаточная длина ({length} символов) - рекомендуется 8+")
        
        # Проверка на распространённые пароли
        if password.lower() in self.common_passwords:
            feedback.append("✗ Пароль входит в список самых распространённых!")
            return 0, feedback, "КРИТИЧЕСКИ СЛАБЫЙ", "мгновенно"
        
        # Проверка различных типов символов
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in self.special for c in password)
        
        if has_upper:
            score += 1
            feedback.append("✓ Есть прописные буквы")
        else:
            feedback.append("✗ Нет прописных букв")
        
        if has_lower:
            score += 1
            feedback.append("✓ Есть строчные буквы")
        else:
            feedback.append("✗ Нет строчных букв")
        
        if has_digit:
            score += 1
            feedback.append("✓ Есть цифры")
        else:
            feedback.append("✗ Нет цифр")
        
        if has_special:
            score += 1
            feedback.append("✓ Есть специальные символы")
        else:
            feedback.append("✗ Нет специальных символов")
        
        # Проверка на разнообразие символов
        unique_chars = len(set(password))
        if unique_chars < length * 0.7:
            feedback.append("⚠ Много повторяющихся символов")
            score -= 0.5
        
        # Оценка надёжности
        if score >= 6:
            strength = "ОТЛИЧНЫЙ"
            time_to_crack = "более 100 лет"
        elif score >= 4:
            strength = "ХОРОШИЙ"
            time_to_crack = "от нескольких месяцев до года"
        elif score >= 2:
            strength = "СРЕДНИЙ"
            time_to_crack = "от нескольких дней до недели"
        else:
            strength = "СЛАБЫЙ"
            time_to_crack = "от нескольких минут до часов"
        
        return score, feedback, strength, time_to_crack
    
    def evaluate_password(self):
        """Оценка надёжности пароля"""
        print("\n" + "="*50)
        print("ПРОВЕРКА НАДЁЖНОСТИ ПАРОЛЯ")
        print("="*50 + "\n")
        
        password = input("Введите пароль для проверки: ")
        
        # Проверка на пустой пароль
        if not password:
            print("Ошибка: пароль не может быть пустым!\n")
            return
        
        result = self.check_password_strength(password)
        
        print("\n" + "="*50)
        print("РЕЗУЛЬТАТ ПРОВЕРКИ:")
        print("="*50)
        
        score, feedback, strength, time_to_crack = result
        for item in feedback:
            print(item)
        
        print(f"Оценка надёжности: {strength}")
        if isinstance(score, (int, float)):
            print(f"Балл: {score:.1f}/6")
        print(f"Примерное время взлома: {time_to_crack}")
        
        # Дополнительные рекомендации для слабых паролей
        if score < 4 and not (password.lower() in self.common_passwords):
            print("РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ:")
            if len(password) < 8:
                print("- Увеличьте длину пароля до 12+ символов")
            if not any(c.isupper() for c in password):
                print("- Добавьте прописные буквы (A-Z)")
            if not any(c.islower() for c in password):
                print("- Добавьте строчные буквы (a-z)")
            if not any(c.isdigit() for c in password):
                print("- Добавьте цифры (0-9)")
            if not any(c in self.special for c in password):
                print("- Добавьте специальные символы (!@#$%^&*()_+)")
        
        print("="*50 + "\n")
    
    def run(self):
        """Главный цикл программы"""
        print("\n" + "="*60)
        print(" ДОБРО ПОЖАЛОВАТЬ В ГЕНЕРАТОР И ОЦЕНЩИК ПАРОЛЕЙ ")
        print("="*60)
        print(" Ваш надёжный помощник в создании безопасных паролей ")
        print("="*60 + "\n")
        
        while True:
            print("ГЛАВНОЕ МЕНЮ:")
            print("1 - Сгенерировать пароль")
            print("2 - Проверить надёжность пароля")
            print("3 - Выйти")
            
            choice = input("Выберите действие (1-3): ").strip()
            
            if choice == '1':
                self.generate_password()
            elif choice == '2':
                self.evaluate_password()
            elif choice == '3':
                print("\n" + "="*50)
                print("Благодарим за использование программы!")
                print("Помните: безопасность начинается с надёжного пароля.")
                print("="*50 + "\n")
                sys.exit(0)
            else:
                print("Ошибка: введите 1, 2 или 3\n")
            
            # Пауза перед возвратом в меню
            input("\nНажмите Enter для продолжения...")
            print("\n" + "-"*60 + "\n")

def main():
    """Точка входа в программу"""
    try:
        app = PasswordManager()
        app.run()
    except KeyboardInterrupt:
        print("Программа прервана пользователем. До свидания!")
        sys.exit(0)

if __name__ == "__main__":
    main()