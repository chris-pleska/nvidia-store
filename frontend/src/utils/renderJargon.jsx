import SpecTerm from "../components/SpecTerm.jsx";

const JARGON_PATTERNS = [
  { term: "vram", regex: /VRAM/gi },
  { term: "inference", regex: /inference/gi },
  { term: "finetuning", regex: /fine-tun(?:e|es|ed|ing)/gi },
  { term: "unified-memory", regex: /unified memory/gi },
  { term: "liquid-cooling", regex: /liquid[- ]cool(?:ed|ing)?/gi },
];

export default function renderJargon(text) {
  const matches = [];
  for (const { term, regex } of JARGON_PATTERNS) {
    const re = new RegExp(regex);
    let match;
    while ((match = re.exec(text)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length, term, value: match[0] });
    }
  }
  matches.sort((a, b) => a.start - b.start);

  const nonOverlapping = [];
  let lastEnd = -1;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      nonOverlapping.push(match);
      lastEnd = match.end;
    }
  }

  const nodes = [];
  let cursor = 0;
  nonOverlapping.forEach((match, index) => {
    if (match.start > cursor) nodes.push(text.slice(cursor, match.start));
    nodes.push(<SpecTerm key={`${match.term}-${index}`} term={match.term} value={match.value} />);
    cursor = match.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}
