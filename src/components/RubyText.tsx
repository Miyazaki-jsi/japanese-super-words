import React from 'react';

function toHiragana(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 0x30a1 && code <= 0x30f6) {
    return String.fromCharCode(code - 0x60);
  }
  return char;
}

function toHiraganaStr(str: string): string {
  return [...str].map(toHiragana).join('');
}

function isKanji(char: string): boolean {
  return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(char);
}

function isKanaChar(char: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(char);
}

function isDigitOrNumberPunct(char: string): boolean {
  return /[0-9０-９.,，、]/.test(char);
}

function suffixMatchesAt(
  jChars: string[],
  j: number,
  rChars: string[],
  r: number,
): boolean {
  while (j < jChars.length || r < rChars.length) {
    if (j >= jChars.length) return r >= rChars.length;
    if (r >= rChars.length) return !jChars.slice(j).some(isKanji);

    if (isKanji(jChars[j])) {
      let kanjiEnd = j;
      while (kanjiEnd < jChars.length && isKanji(jChars[kanjiEnd])) kanjiEnd++;
      for (let tryR = r + 1; tryR <= rChars.length; tryR++) {
        if (suffixMatchesAt(jChars, kanjiEnd, rChars, tryR)) return true;
      }
      return false;
    }

    const c = toHiragana(jChars[j]);
    if (r < rChars.length && toHiragana(rChars[r]) === c) {
      j++;
      r++;
    } else if (!isKanaChar(jChars[j])) {
      if (r < rChars.length && rChars[r] === jChars[j]) {
        j++;
        r++;
      } else {
        j++;
      }
    } else {
      return false;
    }
  }
  return true;
}

function suffixMatches(japanese: string, reading: string): boolean {
  return suffixMatchesAt([...japanese], 0, [...reading], 0);
}

function consumePlainSegment(plainText: string, reading: string, r: number): number {
  let ri = r;
  for (const c of plainText) {
    if (isDigitOrNumberPunct(c)) continue;
    if (isKanaChar(c)) {
      const h = toHiragana(c);
      if (ri < reading.length && reading[ri] === h) ri++;
    } else if (ri < reading.length && reading[ri] === c) {
      ri++;
    }
  }
  return ri;
}

/** After Arabic digits in japanese, skip spoken-number hiragana in reading. */
function skipSpokenNumberReading(readHira: string, r: number, nextChar: string): number {
  if (nextChar === '円') {
    const enIdx = readHira.indexOf('えん', r);
    if (enIdx >= r) return enIdx;
  }
  if (nextChar === '番') {
    const banIdx = readHira.indexOf('ばん', r);
    if (banIdx >= r) return banIdx;
  }
  if (nextChar === '号') {
    const goIdx = readHira.indexOf('ごう', r);
    if (goIdx >= r) return goIdx;
  }
  return r;
}

function findKanjiReadEnd(
  readHira: string,
  r: number,
  japaneseAfterKanji: string,
): number {
  if (!japaneseAfterKanji) return r + 1 <= readHira.length ? r + 1 : r;
  for (let candidate = r + 1; candidate <= readHira.length; candidate++) {
    if (suffixMatches(japaneseAfterKanji, readHira.slice(candidate))) {
      return candidate;
    }
  }
  return r;
}

function buildRubyNodes(japanese: string, reading: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const readHira = toHiraganaStr(reading);
  let j = 0;
  let r = 0;
  let key = 0;

  while (j < japanese.length) {
    if (isDigitOrNumberPunct(japanese[j])) {
      let digitEnd = j;
      while (digitEnd < japanese.length && isDigitOrNumberPunct(japanese[digitEnd])) {
        digitEnd++;
      }
      nodes.push(<span key={key++}>{japanese.slice(j, digitEnd)}</span>);
      j = digitEnd;
      if (j < japanese.length) {
        r = skipSpokenNumberReading(readHira, r, japanese[j]);
      }
      continue;
    }

    if (isKanji(japanese[j])) {
      let kanjiEnd = j;
      while (kanjiEnd < japanese.length && isKanji(japanese[kanjiEnd])) kanjiEnd++;
      const kanjiText = japanese.slice(j, kanjiEnd);
      const readEnd = findKanjiReadEnd(readHira, r, japanese.slice(kanjiEnd));
      const rt = readHira.slice(r, readEnd);

      if (rt) {
        nodes.push(
          <ruby key={key++} className="ruby-text">
            {kanjiText}
            <rt>{rt}</rt>
          </ruby>,
        );
      } else {
        nodes.push(<span key={key++}>{kanjiText}</span>);
      }
      j = kanjiEnd;
      r = readEnd;
      continue;
    }

    const plainStart = j;
    let plainEnd = j;
    while (plainEnd < japanese.length && !isKanji(japanese[plainEnd])) {
      plainEnd++;
    }
    const plainText = japanese.slice(plainStart, plainEnd);
    const readEnd = consumePlainSegment(plainText, readHira, r);

    nodes.push(<span key={key++}>{plainText}</span>);
    j = plainEnd;
    r = readEnd;
  }

  return nodes;
}

export default function RubyText({
  japanese,
  reading,
  className = '',
}: {
  japanese: string;
  reading: string;
  className?: string;
}) {
  return <span className={className}>{buildRubyNodes(japanese, reading)}</span>;
}
