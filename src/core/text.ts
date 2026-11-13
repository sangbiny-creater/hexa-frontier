/** 받침에 맞는 조사: josa('락키', '을', '를') → '락키를' */
export function josa(w: string, withFinal: string, without: string): string {
  const c = w.charCodeAt(w.length - 1);
  const final = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
  return w + (final ? withFinal : without);
}

/** 'X은(는)' 같은 표기를 실제 조사로 바꾼다 */
export function fixJosa(text: string): string {
  // '엠버윙(불 스피릿)이(가)'처럼 괄호 뒤면 괄호 앞 단어 기준
  text = text.replace(/([가-힣A-Za-z0-9]+)(\([^()]*\))(은\(는\)|이\(가\)|을\(를\)|과\(와\)|으로\(로\))/g, (_, w: string, paren: string, p: string) => fixJosa(w + p).replace(w, w + paren));
  return text.replace(/([가-힣A-Za-z0-9]+)(은\(는\)|이\(가\)|을\(를\)|과\(와\)|으로\(로\))/g, (_, w: string, p: string) => {
    const [a, b] = ({ '은(는)': ['은', '는'], '이(가)': ['이', '가'], '을(를)': ['을', '를'], '과(와)': ['과', '와'], '으로(로)': ['으로', '로'] } as Record<string, [string, string]>)[p];
    return josa(w, a, b);
  });
}
