// Получить текстовые, ключевые и языковые значения из полей ввода
  function encrypt() {
    const text = document.getElementById("text-input").value;
    const key = parseInt(document.getElementById("key-input").value);
    const language = document.getElementById("language-select").value;

    const result = ceaserCipher(text, key, language);
    document.getElementById("result").textContent = result;
  }

  function decrypt() {
    const text = document.getElementById("text-input").value;
    const key = parseInt(document.getElementById("key-input").value);
    const language = document.getElementById("language-select").value;

    // Для расшифровки ключ имеет отрицательное значение 
    const result = ceaserCipher(text, -key, language);
    document.getElementById("result").textContent = result;
  }

  function breakCipher1() {
    const text = document.getElementById("text-input").value;
    const language = document.getElementById("language-select").value;
    const key = frequencyAnalysis(text, language);
    // Для расшифровки ключ имеет отрицательное значение 
    const result = ceaserCipher(text, -key, language);
    document.getElementById("result").textContent = result;
  }

  function breakCipher() {
    const text = document.getElementById("text-input").value;
    const language = document.getElementById("language-select").value;
    let result = "";
    
    for (let key = 0; key < 26; key++) {
      let decryptedText = ceaserCipher(text, -key, language);
      result += `Key ${key}: ${decryptedText} \n`;
    }   
    document.getElementById("result").textContent = result;
  }

  function ceaserCipher(user, key, lang) {
    let res = [];
    let n = "";
    let nUpper = "";

    if (lang.toLowerCase() === "russian") {
      let dictionary = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
      let dictionaryUpper = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
      n = dictionary;
      nUpper = dictionaryUpper;
    } else if (lang.toLowerCase() === "english") {
      let dictionary = "abcdefghijklmnopqrstuvwxyz";
      let dictionaryUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      n = dictionary;
      nUpper = dictionaryUpper;
      } else {
        return "Invalid language selection";
      }

    // Выполнение итерации по каждому символу в пользовательском вводе
    for (let i = 0; i < user.length; i++) {
      if (n.includes(user[i]) || nUpper.includes(user[i])) {
         // Если символ находится в определенном алфавите, выполнить операцию шифрования Цезаря            
        for (let j = 0; j < n.length; j++) {
          if (j + key >= 0 && j + key < n.length && user[i] === n[j]) {
            // Если индекс находится в пределах диапазона алфавита, сдвиньте символ на значение ключа  
            res.push(n[j + key]);
          } else if (j + key >= n.length && user[i] === n[j]) {
              // Если индекс превышает диапазон алфавита, выполнить перенос к началу
              res.push(n[(j + key) % (n.length)]);
            } else if (j + key < 0 && user[i] === n[j]) {
                // Если индекс отрицательный, перенести в конец алфавита
                res.push(n[(n.length + j + key) % n.length]);
              }
              else if (j + key >= 0 && j + key < nUpper.length && user[i] === nUpper[j]) {
                // Если символ находится в верхнем регистре
                res.push(nUpper[j + key]);
              } else if (j + key >= nUpper.length && user[i] === nUpper[j]) {
                  // Если индекс превышает диапазон алфавита в верхнем регистре, выполнить перенос к началу
                  res.push(nUpper[(j + key) % (nUpper.length)]);
                } else if (j + key < 0 && user[i] === nUpper[j]) {
                    // Если индекс отрицательный в верхнем регистре, перенести в конец алфавита
                    res.push(nUpper[(nUpper.length + j + key) % nUpper.length]);
                }
        }
      } else {
          // Если символ отсутствует в определенном алфавите, добавить к результату как есть
          res.push(user[i]);
        }
    }
    // Объединить полученный массив символов в строку и вернуть его
    return res.join("");
  }

  function frequencyAnalysis(ciphertext, lang) {
    let n = "";
    let nUpper = "";
  
    if (lang.toLowerCase() === "russian") {
      let dictionary = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
      let dictionaryUpper = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
      n = dictionary;
      nUpper = dictionaryUpper;
    } else if (lang.toLowerCase() === "english") {
        let dictionary = "abcdefghijklmnopqrstuvwxyz";
        let dictionaryUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        n = dictionary;
        nUpper = dictionaryUpper;
      } else {
          return "Invalid language selection";
        }
  
    let frequencyMap = new Map();
    let maxFrequency = 0;
    let mostFrequentChar = "";
  
    // Count the frequency of each character in the ciphertext
    for (let i = 0; i < ciphertext.length; i++) {
      let char = ciphertext[i];

      if (n.includes(char.toLowerCase()) || nUpper.includes(char)) {
        if (frequencyMap.has(char)) {
          frequencyMap.set(char, frequencyMap.get(char) + 1);
        } else {
            frequencyMap.set(char, 1);
          }
          if (frequencyMap.get(char) > maxFrequency) {
            maxFrequency = frequencyMap.get(char);
            mostFrequentChar = char;
          }
      }  
    }
  
    // Find the most probable key based on the most frequent character
    let key = n.indexOf(mostFrequentChar) - n.indexOf("о");
      if (key < 0) {
        key += n.length;
      }
  
    return key;
  }
