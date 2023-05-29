/* This is an implementation of the porter stemming algorithm,
  ref: https://tartarus.org/martin/PorterStemmer/
 some things have been modified in accordance with my own taste */

function isVowel(letter: string): boolean {
  return "aeiou".includes(letter)
}

function substituteKeyWithPair(subs: { [key: string]: string }, word: string): string | null {
  const keys = Object.keys(subs);
  for (const key of keys) {
    if (!word.endsWith(key)) continue;
    const prefix = word.substring(0, word.indexOf(key));
    return prefix + subs[key];
  }
  return null;
}

function measure(word: string): number {
  let result = 0;
  for (let i = 0; i < word.length - 1; i++) {
    const cur = word[i];
    const next = word[i + 1];
    if (!isVowel(cur) && !isVowel(next)) continue;
    if (isVowel(cur) && isVowel(next)) continue;
    if (isVowel(cur) && !isVowel(next)) result++;
  }
  return result;
}

function containsVowel(str: string, suffix?: string): boolean {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  suffix = suffix ?? str.slice(-1);
  const pre = str.substring(0, str.indexOf(suffix));
  const last = pre[pre.length - 1];
  const secLast = pre[pre.length - 2];
  const thirdLast = pre[pre.length - 3];
  return vowels.has(last) || vowels.has(secLast) || vowels.has(thirdLast);
}

function hasDoubleConsonant(stem: string): boolean {
  const doubleConsonants = ['bb', 'cc', 'dd', 'ff', 'gg', 'hh', 'jj', 'kk', 'll', 'mm',
                            'nn', 'pp', 'qq', 'rr', 'tt', 'vv', 'ww', 'xx', 'yy', 'zz'];
  const lastTwoChars = stem.slice(-2).toLowerCase();
  return doubleConsonants.includes(lastTwoChars) && !['l', 's', 'z'].includes(lastTwoChars[0]);
}

function endsWithCVC(stem: string): boolean {
  const lastThreeChars = stem.slice(-3).toLowerCase();
  return /^[^aeiou][aeiou][^aeiouwxys]$/.test(lastThreeChars);
}

function step1A(word: string): string {
  const subs: { [key: string]: string } = {
    "sses": "ss",
    "ies": "i",
    "ss": "ss",
    "s": "",
  };
  return substituteKeyWithPair(subs, word) || word;
}

function step1BNext(word: string): string {
  const subs: { [key: string]: string } = {
    "at": "ate",
    "bl": "ble",
    "iz": "ize",
    "s": "",
  };

  const val = substituteKeyWithPair(subs, word);
  if (val) {
    return val;
  }

  if (hasDoubleConsonant(word)) {
    return word.substring(0, word.length - 1);
  }

  return word;
}

function step1B(word: string): string {
  const m = measure(word);

  if (m > 0 && word.endsWith("eed")) {
    const prefix = word.substring(0, word.indexOf("eed"));
    if (prefix === word) return word;
    return prefix + "ee";
  }

  if (word.endsWith("ed") && containsVowel(word, "ed")) {
    return step1BNext(word.substring(0, word.indexOf("ed")));
  }

  if (word.endsWith("ing") && containsVowel(word, "ing")) {
    return step1BNext(word.substring(0, word.indexOf("ing")));
  }

  return word;
}

function step1C(word: string): string {
   if (containsVowel(word)) {
      return word.substring(0, word.length - 1) + "i";
   }
   return word;
}

function step2(word: string): string {
  if (measure(word) === 0) return word;

  const subs: { [key: string]: string } = {
    "ational": "ate",
    "tional": "tion",
    "enci": "ence",
    "anci": "ance",
    "izer": "ize",
    "abli": "able",
    "alli": "al",
    "entli": "ent",
    "eli": "e",
    "ousli": "ous",
    "ization": "ize",
    "ation": "ate",
    "ator": "ate",
    "alism": "al",
    "iveness": "ive",
    "fulness": "ful",
    "ousness": "ous",
    "aliti": "al",
    "iviti": "ive",
    "biliti": "ble"
  };

  return substituteKeyWithPair(subs, word) || word;
}

function step3(word: string): string {
  if (measure(word) === 0) return word;
  const subs: { [key: string]: string } = {
    "icate": "ic",
    "ative": "",
    "alize": "al",
    "iciti": "ic",
    "ical": "ic",
    "ful": "",
    "ness": ""
  };

  return substituteKeyWithPair(subs, word) || word;
}

function step4(word: string): string {
  if (measure(word) < 1) return word;
  const subs: { [key: string]: string } = {
    "al": "",
    "ance": "",
    "ence": "",
    "er": "",
    "ic": "",
    "able": "",
    "ible": "",
    "ant": "",
    "ement": "",
    "ment": "",
    "ent": "",
    "ion": "",
    "ou": "",
    "ism": "",
    "ate": "",
    "iti": "",
    "ous": "",
    "ive": "",
    "ize": ""
  };

  return substituteKeyWithPair(subs, word) || word;
}


export default function stem(word: string): string {
  let stem1 =  step1B(step1A(word));
  let stem2 = step2(stem1);
  return stem1 ?? word;
}
