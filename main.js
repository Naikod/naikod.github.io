function UnshuffleArray(array, seed) {
  let newArray = array.slice();
  let shuffledIndices = ShuffleArray(Array.from(Array(newArray.length).keys()), seed);
  let unshuffledArray = Array(newArray.length);
  for (let i = 0; i < newArray.length; i++) {
    unshuffledArray[shuffledIndices[i]] = newArray[i];
  }
  return unshuffledArray;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
    hash = Math.abs(hash); // Ensure positive value
  }
  return hash;
}

function ShuffleArray(array, seed) {
  let newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor((seed + i) % (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}


function charForKey() {
  let charSet = []
  charSet.push(...Array.from({ length: 10 }, (_, i) => String.fromCharCode(i + 48)));
  charSet.push(...Array.from({ length: 6 }, (_, i) => String.fromCharCode(i + 65)));
  charSet.push(...Array.from({ length: 6 }, (_, i) => String.fromCharCode(i + 97)));
  return charSet
}

function GenerateKey() {
  let arr = [new Array(11), new Array(9)]
  let chars = charForKey()
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j]) {
        arr[i][j] = undefined;
      }
      const randomIndex = Math.floor(Math.random() * chars.length);
      arr[i][j] = chars[randomIndex];
      chars.splice(randomIndex, 1);
    }
  }
  return arr
}

function GenerateKeyMap() {
  let ascii = 32
  let KeyMap = Array.from({ length: 9 }, () => Array(0))
  do {
    for (let i = 0; i < 9; i++) {
      if (i == 8) {
        for (let j = 0; j < 7; j++) {
          KeyMap[i].push(String.fromCharCode(ascii))
          ascii++
        }
      } else {
        for (let j = 0; j < 11; j++) {
          KeyMap[i].push(String.fromCharCode(ascii))
          ascii++
        }
      }
    }
  } while (ascii <= 126)
  return KeyMap
}

class Chiperline {
  constructor(key) {
    if (!key) {
      throw new Error("Key must be provided");
    }
    this.key = hashString(key);
  }

  encrypt(string) {
    let OriginalKey = GenerateKey(), KeyMap = GenerateKeyMap();
    let StoreKey = "", Result = "";
    for (let char of string) {
      let on = ""
      let col = -1, row = -1;
      for (let i = 0; i < KeyMap.length; i++) {
        const index = KeyMap[i].indexOf(char);
        if (index !== -1) {
          row = i;
          col = index
          let seed = Math.floor(Math.random() * (99 - 10 + 1) + 10)
          let KeyToObfus = OriginalKey.map(innerArray => innerArray.slice());
          KeyToObfus = [ShuffleArray(OriginalKey[0], seed), ShuffleArray(OriginalKey[1], seed)]
          Result += `${KeyToObfus[0][col]}${KeyToObfus[1][row]}${seed}`
          break;
        }
      }
      // if(row == -1 || col == -1) return console.log(on)
    }
    let seed = Math.floor(Math.random() * (126 - 32 + 1) + 32)
    OriginalKey = [ShuffleArray(OriginalKey[0], seed), ShuffleArray(OriginalKey[1], seed)]
    StoreKey = OriginalKey.map(innerArray => innerArray.join("")).join("");
    const hasedResult = ShuffleArray([...StoreKey, ...Result], this.key)
    return `${String.fromCharCode(seed)}${hasedResult.join('')}.sportline`
  }

  decrypt(string) {
    let GetSeed = string.charCodeAt(0), KeyMap = GenerateKeyMap();
    string = string.slice(1, string.length)
    string = `${UnshuffleArray([...string.slice(0, string.length - 10)], this.key).join('')}.sportline`
    let GetOriginalKey = [UnshuffleArray(string.slice(0, 11).split(""), GetSeed), UnshuffleArray(string.slice(11, 20).split(""), GetSeed)];
    string = string.slice(20, string.length - 10)
    let Result = "", i = 0;
    while (i < string.length) {
      const col = ShuffleArray(GetOriginalKey[0], Number(string[i + 2] + string[i + 3])).indexOf(string[i]);
      const row = ShuffleArray(GetOriginalKey[1], Number(string[i + 2] + string[i + 3])).indexOf(string[i + 1]);
      if (col !== -1 && row !== -1) {
        Result += KeyMap[row][col]
      } else {
        Result += string[i]
      }
      i += 4
    }
    return Result
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (character) {
      var randomDigit = Math.random() * 16 | 0;
      var digitValue = (character === 'x') ? randomDigit : (randomDigit & 0x3 | 0x8);
      return digitValue.toString(16);
    });
  }

  randomName(words_length) {
    const wordLength = words_length;
    let name = '';
    const vowels = "aiueo";
    const consonants = "bcdfghjklmnpqrstvwyz";
    for (let i = 0; i < wordLength; i++) {
      let charlength = Math.floor(Math.random() * 5) + 3
      for (let i2 = 0; i2 < charlength; i2++) {
        if (i2 % 2 == 0) {
          if (i2 == 0) {
            name += consonants[Math.floor(Math.random() * consonants.length)].toUpperCase();
          } else {
            name += consonants[Math.floor(Math.random() * consonants.length)];
          }
        } else {
          name += vowels[Math.floor(Math.random() * vowels.length)]
        }
      }
      name += " "
    }
    return name;
  }
  randomInt(min, max) {
    return Math.floor(Math.random() * max) + min
  }
  randomString(length){
    let result = ""
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" 
    for(let i = 0;i<length;i++){
      result += char[Math.floor(Math.random() * char.length)]
    }
    return result
  }
}
module.exports = Chiperline;
