"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LevelCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type Screen = "today" | "path" | "series" | "speak" | "progress" | "lesson";
type PracticeMode = "listen" | "shadow" | "recall" | "roleplay";

type Phrase = { en: string; fr: string; hint: string; reply: string };
type Level = {
  code: LevelCode;
  name: string;
  promise: string;
  duration: string;
  color: string;
  modules: { icon: string; title: string; goal: string; sessions: number }[];
  phrases: Phrase[];
};

const levels: Level[] = [
  {
    code: "A1", name: "Premier contact", promise: "Vous présenter et gérer les besoins immédiats.", duration: "4–6 semaines", color: "#ff6d52",
    modules: [
      { icon: "01", title: "Se présenter", goal: "Nom, origine et activité", sessions: 6 },
      { icon: "02", title: "Au quotidien", goal: "Commander, payer, demander", sessions: 8 },
      { icon: "03", title: "Se déplacer", goal: "Directions et transports", sessions: 7 },
      { icon: "04", title: "Famille et amis", goal: "Présenter ses proches", sessions: 6 },
      { icon: "05", title: "Heure et nombres", goal: "Dates, prix et rendez-vous", sessions: 7 },
      { icon: "06", title: "Urgences utiles", goal: "Santé, aide et sécurité", sessions: 6 },
    ],
    phrases: [
      { en: "Hi, I'm Samira. Nice to meet you.", fr: "Bonjour, je suis Samira. Enchantée.", hint: "haï, aïm sa-mi-ra · naïs tou mit you", reply: "Nice to meet you too! Where are you from?" },
      { en: "Could I have a coffee, please?", fr: "Pourrais-je avoir un café, s'il vous plaît ?", hint: "koud aï hav e co-fi pliz", reply: "Of course. Anything else?" },
      { en: "I don't understand. Could you repeat?", fr: "Je ne comprends pas. Pouvez-vous répéter ?", hint: "aï dont under-stand · koud you ri-pit", reply: "Sure. I'll speak more slowly." },
      { en: "Where is the train station?", fr: "Où se trouve la gare ?", hint: "wèr iz ze tréïn stéï-cheun", reply: "Go straight and turn left." },
    ],
  },
  {
    code: "A2", name: "Vie quotidienne", promise: "Échanger simplement sur vos habitudes et projets.", duration: "6–8 semaines", color: "#e8a93f",
    modules: [
      { icon: "01", title: "Raconter sa journée", goal: "Habitudes et fréquence", sessions: 8 },
      { icon: "02", title: "Faire des projets", goal: "Inviter et organiser", sessions: 8 },
      { icon: "03", title: "Décrire simplement", goal: "Personnes, lieux, expériences", sessions: 9 },
      { icon: "04", title: "Faire des achats", goal: "Comparer, choisir et retourner", sessions: 7 },
      { icon: "05", title: "Santé et bien-être", goal: "Symptômes et conseils simples", sessions: 7 },
      { icon: "06", title: "Voyages et vacances", goal: "Réserver et raconter", sessions: 9 },
    ],
    phrases: [
      { en: "I usually start work at nine.", fr: "Je commence généralement à travailler à neuf heures.", hint: "aï you-jou-a-li start work at naïn", reply: "And what time do you finish?" },
      { en: "Would you like to have lunch tomorrow?", fr: "Voulez-vous déjeuner demain ?", hint: "woud you laïk tou hav leuntch tou-mo-ro", reply: "I'd love to. What time?" },
      { en: "I went there last summer and loved it.", fr: "J'y suis allé l'été dernier et j'ai adoré.", hint: "aï went zèr last seumeur and leuvd it", reply: "What did you like most?" },
      { en: "I'm looking for something less expensive.", fr: "Je cherche quelque chose de moins cher.", hint: "aïm lou-king for seum-thing less ik-spen-siv", reply: "This one is on sale today." },
    ],
  },
  {
    code: "B1", name: "Conversation autonome", promise: "Raconter, expliquer et vous débrouiller en voyage.", duration: "8–10 semaines", color: "#3fa985",
    modules: [
      { icon: "01", title: "Raconter une histoire", goal: "Passé, détails et émotions", sessions: 10 },
      { icon: "02", title: "Donner son avis", goal: "Accord, désaccord, raisons", sessions: 10 },
      { icon: "03", title: "Résoudre un problème", goal: "Clarifier et négocier", sessions: 10 },
      { icon: "04", title: "Projets et objectifs", goal: "Intentions et conditions", sessions: 9 },
      { icon: "05", title: "Médias et actualité", goal: "Résumer une information", sessions: 10 },
      { icon: "06", title: "Relations sociales", goal: "Conseiller et rassurer", sessions: 9 },
    ],
    phrases: [
      { en: "The best part was meeting people from everywhere.", fr: "Le mieux, c'était de rencontrer des gens de partout.", hint: "ze best part woz mi-ting pi-pol from ev-ri-wèr", reply: "That sounds amazing. Did you stay in touch?" },
      { en: "In my opinion, working remotely saves a lot of time.", fr: "À mon avis, le télétravail fait gagner beaucoup de temps.", hint: "in maï o-pi-nion · wor-king ri-mot-li séïvz taïm", reply: "I agree, although it can feel lonely." },
      { en: "There seems to be a mistake on my bill.", fr: "Il semble y avoir une erreur sur ma facture.", hint: "zèr simz tou bi e mis-téïk on maï bil", reply: "Let me check that for you." },
      { en: "If the weather is good, we'll go hiking.", fr: "S'il fait beau, nous irons randonner.", hint: "if ze wè-zeur iz goud · wil go haï-king", reply: "Great. I'll bring some water." },
    ],
  },
  {
    code: "B2", name: "Aisance et précision", promise: "Débattre et communiquer naturellement au travail.", duration: "10–12 semaines", color: "#357f91",
    modules: [
      { icon: "01", title: "Argumenter", goal: "Nuancer et convaincre", sessions: 12 },
      { icon: "02", title: "Anglais professionnel", goal: "Réunions et présentations", sessions: 12 },
      { icon: "03", title: "Parler spontanément", goal: "Fluidité et expressions naturelles", sessions: 12 },
      { icon: "04", title: "Négocier", goal: "Proposer et trouver un accord", sessions: 10 },
      { icon: "05", title: "Présenter un projet", goal: "Structure, impact et questions", sessions: 12 },
      { icon: "06", title: "Culture et société", goal: "Analyser et comparer", sessions: 11 },
    ],
    phrases: [
      { en: "I see your point, but we should consider the long-term impact.", fr: "Je comprends votre point de vue, mais considérons l'impact à long terme.", hint: "aï si yor poïnt · beut wi choud con-si-deur ze long teurm im-pact", reply: "That's fair. What risks do you anticipate?" },
      { en: "Let me walk you through the main findings.", fr: "Permettez-moi de vous présenter les principales conclusions.", hint: "let mi wok you frou ze méïn faïn-dings", reply: "Please do. I'm particularly interested in the trends." },
      { en: "Had we known earlier, we could have avoided the delay.", fr: "Si nous l'avions su plus tôt, nous aurions pu éviter le retard.", hint: "had wi non eur-li-eur · wi koud hav e-voï-did ze di-léï", reply: "Agreed. Let's improve the reporting process." },
      { en: "What I find most compelling is the simplicity of the idea.", fr: "Ce que je trouve le plus convaincant, c'est la simplicité de l'idée.", hint: "wot aï faïnd most com-pe-ling iz ze sim-pli-si-ti", reply: "Exactly. It solves a complex problem elegantly." },
    ],
  },
  {
    code: "C1", name: "Expression avancée", promise: "Vous exprimer avec souplesse, nuance et impact.", duration: "12–16 semaines", color: "#625aa8",
    modules: [
      { icon: "01", title: "Nuances et registre", goal: "Adapter le ton au contexte", sessions: 14 },
      { icon: "02", title: "Prise de parole", goal: "Structurer et captiver", sessions: 14 },
      { icon: "03", title: "Idées complexes", goal: "Synthétiser et reformuler", sessions: 14 },
      { icon: "04", title: "Leadership", goal: "Influencer avec diplomatie", sessions: 12 },
      { icon: "05", title: "Écriture vers l'oral", goal: "Transformer un texte en discours", sessions: 12 },
      { icon: "06", title: "Humour et implicite", goal: "Comprendre ce qui n'est pas dit", sessions: 14 },
    ],
    phrases: [
      { en: "Broadly speaking, the proposal is sound, albeit somewhat ambitious.", fr: "Dans l'ensemble, la proposition est solide, quoique quelque peu ambitieuse.", hint: "brod-li spi-king · ze pro-po-zol iz saound · ol-bi-it seum-wot am-bi-cheus", reply: "Which aspects strike you as overly ambitious?" },
      { en: "What this ultimately boils down to is a question of trust.", fr: "En fin de compte, tout cela se résume à une question de confiance.", hint: "wot zis eul-ti-mat-li boïlz daoun tou iz e kwes-tcheun ov treust", reply: "Then rebuilding credibility should be our priority." },
      { en: "I wouldn't go so far as to dismiss the idea altogether.", fr: "Je n'irais pas jusqu'à rejeter complètement l'idée.", hint: "aï wou-deunt go so far az tou dis-mis zi aï-di-a", reply: "So which parts would you retain?" },
      { en: "The evidence is compelling, yet it warrants a cautious interpretation.", fr: "Les preuves sont convaincantes, mais méritent une interprétation prudente.", hint: "zi e-vi-deuns iz com-pe-ling · yet it wo-rents e co-cheus in-teur-pri-téï-cheun", reply: "What limitations should we keep in mind?" },
    ],
  },
  {
    code: "C2", name: "Maîtrise naturelle", promise: "Communiquer avec finesse dans toute situation exigeante.", duration: "Progression continue", color: "#a04f76",
    modules: [
      { icon: "01", title: "Rhétorique", goal: "Persuasion, humour et sous-entendus", sessions: 16 },
      { icon: "02", title: "Voix personnelle", goal: "Style, rythme et précision", sessions: 16 },
      { icon: "03", title: "Expertise", goal: "Débats et contextes spécialisés", sessions: 16 },
      { icon: "04", title: "Langue idiomatique", goal: "Images, allusions et collocations", sessions: 16 },
      { icon: "05", title: "Médiation", goal: "Reformuler des positions complexes", sessions: 14 },
      { icon: "06", title: "Improvisation", goal: "Réagir avec finesse et naturel", sessions: 16 },
    ],
    phrases: [
      { en: "The argument is persuasive at first glance, but it rests on a false dichotomy.", fr: "L'argument est convaincant à première vue, mais repose sur une fausse dichotomie.", hint: "zi ar-gu-ment iz peur-swéï-siv at feurst glans · beut it rests on e fols daï-ko-to-mi", reply: "How would you reframe the alternatives?" },
      { en: "Her understated delivery lent the remark an unexpected poignancy.", fr: "Son ton retenu a donné à la remarque une émotion inattendue.", hint: "heur eun-deur-stéï-tid di-li-ve-ri lent ze ri-mark an eun-ik-spec-tid poï-gnan-si", reply: "The restraint made it all the more powerful." },
      { en: "That interpretation, while not implausible, overlooks a crucial distinction.", fr: "Cette interprétation, bien que plausible, néglige une distinction cruciale.", hint: "zat in-teur-pri-téï-cheun · waïl not im-plo-zi-bol · o-veur-louks e crou-cheul dis-tinc-cheun", reply: "Could you elaborate on that distinction?" },
      { en: "He has an uncanny knack for making the intricate seem self-evident.", fr: "Il a un talent étonnant pour rendre l'intriqué évident.", hint: "hi haz an eun-ca-ni nak for méï-king zi in-tri-ket sim self-e-vi-deunt", reply: "That's the hallmark of a gifted communicator." },
    ],
  },
];

type Episode = {
  level: LevelCode;
  number: number;
  title: string;
  place: string;
  duration: string;
  synopsis: string;
  dialogue: { speaker: "Maya" | "Leo"; en: string; fr: string }[];
  vocabulary: { word: string; meaning: string }[];
  question: string;
  choices: string[];
  answer: string;
};

const episodes: Episode[] = [
  {
    level: "A1", number: 1, title: "Le nouveau voisin", place: "L'entrée de l'immeuble", duration: "1 min 10",
    synopsis: "Maya rencontre Leo pour la première fois et lui propose son aide.",
    dialogue: [
      { speaker: "Maya", en: "Hi! Are you new here?", fr: "Bonjour ! Vous êtes nouveau ici ?" },
      { speaker: "Leo", en: "Yes, I am. I moved in this morning.", fr: "Oui. J'ai emménagé ce matin." },
      { speaker: "Maya", en: "Welcome! I'm Maya. I live upstairs.", fr: "Bienvenue ! Je suis Maya. J'habite à l'étage." },
      { speaker: "Leo", en: "Nice to meet you, Maya. I'm Leo.", fr: "Enchanté, Maya. Je suis Leo." },
      { speaker: "Maya", en: "Do you need help with those boxes?", fr: "Avez-vous besoin d'aide avec ces cartons ?" },
      { speaker: "Leo", en: "That would be great. Thank you!", fr: "Ce serait super. Merci !" },
    ],
    vocabulary: [{ word: "move in", meaning: "emménager" }, { word: "upstairs", meaning: "à l'étage" }, { word: "That would be great", meaning: "Ce serait super" }],
    question: "Où habite Maya ?", choices: ["À l'étage", "Dans la rue voisine", "Avec Leo"], answer: "À l'étage",
  },
  {
    level: "A2", number: 2, title: "Un déjeuner improvisé", place: "Devant le bureau", duration: "1 min 20",
    synopsis: "Une invitation change le programme de la journée.",
    dialogue: [
      { speaker: "Leo", en: "Have you got any plans for lunch?", fr: "Tu as prévu quelque chose pour déjeuner ?" },
      { speaker: "Maya", en: "Not really. I usually bring something from home.", fr: "Pas vraiment. J'apporte généralement quelque chose de chez moi." },
      { speaker: "Leo", en: "There's a new café around the corner.", fr: "Il y a un nouveau café au coin de la rue." },
      { speaker: "Maya", en: "Sounds good. Is it expensive?", fr: "Ça me plaît. Est-ce cher ?" },
      { speaker: "Leo", en: "No, and they have a lunch special today.", fr: "Non, et ils ont un menu du jour." },
      { speaker: "Maya", en: "Perfect. Let me grab my coat.", fr: "Parfait. Laisse-moi prendre mon manteau." },
    ],
    vocabulary: [{ word: "Not really", meaning: "Pas vraiment" }, { word: "around the corner", meaning: "au coin de la rue" }, { word: "grab my coat", meaning: "prendre mon manteau" }],
    question: "Pourquoi choisissent-ils le nouveau café ?", choices: ["Il propose un menu du jour", "Il est dans leur immeuble", "Maya y travaille"], answer: "Il propose un menu du jour",
  },
  {
    level: "B1", number: 3, title: "Le train manqué", place: "La gare centrale", duration: "1 min 35",
    synopsis: "Un retard devient l'occasion de trouver une solution ensemble.",
    dialogue: [
      { speaker: "Maya", en: "I can't believe we missed it by two minutes.", fr: "Je n'arrive pas à croire que nous l'avons raté de deux minutes." },
      { speaker: "Leo", en: "The traffic was much worse than I expected.", fr: "La circulation était bien pire que prévu." },
      { speaker: "Maya", en: "The next direct train isn't until six.", fr: "Le prochain train direct n'est pas avant six heures." },
      { speaker: "Leo", en: "What if we take the local train and change at Bristol?", fr: "Et si nous prenions le train régional avec un changement à Bristol ?" },
      { speaker: "Maya", en: "It takes longer, but we'd still arrive before dinner.", fr: "C'est plus long, mais nous arriverions avant le dîner." },
      { speaker: "Leo", en: "Let's do that. I'll buy the tickets this time.", fr: "Faisons cela. Cette fois, j'achète les billets." },
    ],
    vocabulary: [{ word: "miss a train", meaning: "rater un train" }, { word: "What if…?", meaning: "Et si… ?" }, { word: "this time", meaning: "cette fois" }],
    question: "Quelle solution choisissent-ils ?", choices: ["Attendre le train direct", "Prendre un train avec correspondance", "Louer une voiture"], answer: "Prendre un train avec correspondance",
  },
  {
    level: "B2", number: 4, title: "Le projet en danger", place: "Une salle de réunion", duration: "1 min 45",
    synopsis: "Maya et Leo doivent défendre un projet malgré un délai serré.",
    dialogue: [
      { speaker: "Leo", en: "The client wants the launch brought forward by three weeks.", fr: "Le client veut avancer le lancement de trois semaines." },
      { speaker: "Maya", en: "That's ambitious. We'd have to reduce the initial scope.", fr: "C'est ambitieux. Il faudrait réduire le périmètre initial." },
      { speaker: "Leo", en: "I agree, but they insist that every feature is essential.", fr: "Je suis d'accord, mais ils affirment que chaque fonction est essentielle." },
      { speaker: "Maya", en: "Then let's show them the trade-offs instead of simply saying no.", fr: "Alors montrons-leur les compromis plutôt que de simplement refuser." },
      { speaker: "Leo", en: "Good point. We can propose a phased launch.", fr: "Bonne remarque. Nous pouvons proposer un lancement progressif." },
      { speaker: "Maya", en: "Exactly. That keeps the deadline realistic without blocking progress.", fr: "Exactement. Cela garde un délai réaliste sans bloquer l'avancement." },
    ],
    vocabulary: [{ word: "bring forward", meaning: "avancer une date" }, { word: "scope", meaning: "périmètre" }, { word: "trade-off", meaning: "compromis" }],
    question: "Que proposent-ils au client ?", choices: ["Un lancement progressif", "Une annulation", "Une équipe plus petite"], answer: "Un lancement progressif",
  },
  {
    level: "C1", number: 5, title: "Le choix difficile", place: "Un café calme", duration: "1 min 55",
    synopsis: "Une décision professionnelle révèle des priorités opposées.",
    dialogue: [
      { speaker: "Maya", en: "On paper, the offer is almost impossible to turn down.", fr: "Sur le papier, l'offre est presque impossible à refuser." },
      { speaker: "Leo", en: "Yet you don't sound particularly excited about it.", fr: "Pourtant, tu n'as pas l'air particulièrement enthousiaste." },
      { speaker: "Maya", en: "The role is prestigious, but it would leave little room for the work I actually value.", fr: "Le poste est prestigieux, mais laisserait peu de place au travail qui compte vraiment pour moi." },
      { speaker: "Leo", en: "So the real question isn't whether it's a good opportunity, but whether it's right for you.", fr: "La vraie question n'est donc pas si c'est une bonne occasion, mais si elle te convient." },
      { speaker: "Maya", en: "That's precisely what I've been struggling to articulate.", fr: "C'est précisément ce que j'avais du mal à formuler." },
      { speaker: "Leo", en: "Then perhaps turning it down wouldn't be a failure, but a deliberate choice.", fr: "Alors la refuser ne serait peut-être pas un échec, mais un choix délibéré." },
    ],
    vocabulary: [{ word: "on paper", meaning: "en théorie / sur le papier" }, { word: "turn down", meaning: "refuser" }, { word: "struggle to articulate", meaning: "avoir du mal à formuler" }],
    question: "Pourquoi Maya hésite-t-elle ?", choices: ["Le poste est mal payé", "Le poste éloigne du travail qu'elle apprécie", "Elle doit déménager demain"], answer: "Le poste éloigne du travail qu'elle apprécie",
  },
  {
    level: "C2", number: 6, title: "Entre les lignes", place: "Après une conférence", duration: "2 min 05",
    synopsis: "Un compliment ambigu déclenche une lecture plus subtile de la situation.",
    dialogue: [
      { speaker: "Leo", en: "Did you catch what the chair said about my presentation?", fr: "As-tu saisi ce que la présidente a dit de ma présentation ?" },
      { speaker: "Maya", en: "That it was remarkably thorough? It sounded complimentary enough.", fr: "Qu'elle était remarquablement exhaustive ? Cela semblait assez élogieux." },
      { speaker: "Leo", en: "Perhaps, though 'thorough' can be a diplomatic way of saying overlong.", fr: "Peut-être, même si « exhaustive » peut être une façon diplomatique de dire trop longue." },
      { speaker: "Maya", en: "True, but her follow-up question suggested genuine curiosity rather than impatience.", fr: "C'est vrai, mais sa question suivante suggérait une réelle curiosité plutôt que de l'impatience." },
      { speaker: "Leo", en: "I may be reading too much into a carefully chosen adjective.", fr: "Je surinterprète peut-être un adjectif soigneusement choisi." },
      { speaker: "Maya", en: "We all do when the stakes feel high. Take the compliment at face value.", fr: "Nous le faisons tous lorsque l'enjeu paraît important. Prends le compliment au pied de la lettre." },
    ],
    vocabulary: [{ word: "catch what someone said", meaning: "saisir ce que quelqu'un a dit" }, { word: "read too much into", meaning: "surinterpréter" }, { word: "at face value", meaning: "au pied de la lettre" }],
    question: "Comment Maya interprète-t-elle la remarque ?", choices: ["Comme une critique certaine", "Comme un compliment probablement sincère", "Comme une plaisanterie"], answer: "Comme un compliment probablement sincère",
  },
];

const method = [
  { mode: "listen" as PracticeMode, icon: "1", label: "Écouter", time: "2 min", text: "Comprenez le sens et le rythme." },
  { mode: "shadow" as PracticeMode, icon: "2", label: "Imiter", time: "5 min", text: "Répétez avec la même musique." },
  { mode: "recall" as PracticeMode, icon: "3", label: "Rappeler", time: "4 min", text: "Retrouvez la phrase sans regarder." },
  { mode: "roleplay" as PracticeMode, icon: "4", label: "Parler", time: "4 min", text: "Répondez dans une vraie situation." },
];

const clairMethod = [
  { letter: "C", title: "Contextualiser", copy: "Une scène réelle donne immédiatement du sens aux mots." },
  { letter: "L", title: "Lier", copy: "Vocabulaire, grammaire et prononciation restent dans la même situation." },
  { letter: "A", title: "Activer", copy: "Vous retrouvez la phrase sans la relire ni traduire mot à mot." },
  { letter: "I", title: "Interagir", copy: "Vous adaptez la réponse à votre vie et vous la dites à voix haute." },
  { letter: "R", title: "Réviser", copy: "Le coach reprogramme uniquement ce qui risque d'être oublié." },
];

const grammarNotes: Record<LevelCode, { title: string; explanation: string; formula: string }> = {
  A1: { title: "Pourquoi “Could I have…” ?", explanation: "Could rend la demande polie. Utilisez cette structure au café, au restaurant ou dans un magasin.", formula: "Could I have + chose + please?" },
  A2: { title: "Pourquoi “Would you like…” ?", explanation: "Would you like sert à proposer quelque chose avec douceur, sans donner d'ordre.", formula: "Would you like + nom / to + verbe?" },
  B1: { title: "Relier opinion et raison", explanation: "Annoncez votre position, puis donnez une raison concrète. La clarté compte plus que la complexité.", formula: "In my opinion… because…" },
  B2: { title: "Nuancer sans bloquer", explanation: "I see your point reconnaît l'idée de l'autre avant de présenter une objection. C'est naturel et diplomatique.", formula: "I see your point, but we should…" },
  C1: { title: "Exprimer une réserve fine", explanation: "Albeit condense une concession et appartient à un registre soutenu. À l'oral, although reste plus courant.", formula: "Idée positive, albeit + réserve" },
  C2: { title: "Nommer un raisonnement trompeur", explanation: "A false dichotomy réduit artificiellement plusieurs possibilités à deux choix opposés.", formula: "It rests on + critique précise" },
};

const lessonContexts: Record<LevelCode, { scene: string; intention: string; personal: string }> = {
  A1: { scene: "Vous commandez seul dans un café fréquenté.", intention: "Obtenir quelque chose poliment", personal: "Remplacez coffee par ce que vous commandez vraiment." },
  A2: { scene: "Vous organisez un déjeuner avec un ami anglophone.", intention: "Proposer sans imposer", personal: "Choisissez votre vrai jour, votre heure et votre lieu." },
  B1: { scene: "Une conversation amicale porte sur une expérience récente.", intention: "Raconter et faire ressentir", personal: "Ajoutez un souvenir précis que vous avez réellement vécu." },
  B2: { scene: "Une réunion exige un désaccord clair mais diplomatique.", intention: "Nuancer et convaincre", personal: "Utilisez une objection liée à votre travail ou à un vrai projet." },
  C1: { scene: "Vous analysez une proposition devant des interlocuteurs exigeants.", intention: "Formuler une réserve avec finesse", personal: "Remplacez la proposition par un sujet que vous connaissez bien." },
  C2: { scene: "Vous devez déceler et expliquer une faiblesse de raisonnement.", intention: "Argumenter avec précision", personal: "Appliquez la structure à un débat ou une décision réelle." },
};

type SpeechResultEvent = { results: { 0: { transcript: string } }[] };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

type SpeechAttempt = { id: string; level: LevelCode; phrase: string; score: number; weakWords: string[]; createdAt: number };
type ReviewItem = { id: string; level: LevelCode; phraseIndex: number; phrase: string; dueAt: number; reason: string };
type AccentRegion = "france" | "maghreb" | "africa" | "canada" | "europe";
type TargetAccent = "uk" | "us";

const diagnosticQuestions = [
  { skill: "Compréhension", prompt: "Que signifie : “Could you give me a hand?”", choices: ["Pouvez-vous m'aider ?", "Pouvez-vous me saluer ?", "Pouvez-vous patienter ?"], answer: 0, band: 1 },
  { skill: "Grammaire", prompt: "Complétez : I ___ here since 2022.", choices: ["live", "lived", "have lived"], answer: 2, band: 2 },
  { skill: "Usage", prompt: "Quelle phrase sonne naturelle ?", choices: ["I am agree", "I agree", "I have agree"], answer: 1, band: 2 },
  { skill: "Compréhension", prompt: "“We might as well leave” exprime…", choices: ["une obligation", "une option raisonnable", "une interdiction"], answer: 1, band: 3 },
  { skill: "Précision", prompt: "Complétez : Had I known, I ___ earlier.", choices: ["would call", "would have called", "called"], answer: 1, band: 4 },
  { skill: "Registre", prompt: "Pour nuancer poliment un désaccord :", choices: ["You're wrong.", "I see your point; however…", "No, impossible."], answer: 1, band: 4 },
  { skill: "Nuance", prompt: "“Albeit” est le plus proche de…", choices: ["because", "although", "therefore"], answer: 1, band: 5 },
  { skill: "Maîtrise", prompt: "Une “false dichotomy” est…", choices: ["un faux choix entre deux options", "une preuve irréfutable", "une répétition élégante"], answer: 0, band: 6 },
];

const sessionFormats = [
  ["Déclic", "Comprendre la situation et les mots indispensables"],
  ["Oreille", "Reconnaître l'anglais naturel à trois vitesses"],
  ["Construction", "Assembler les phrases sans traduire mot à mot"],
  ["Prononciation", "Corriger les sons difficiles pour les francophones"],
  ["Dialogue", "Répondre dans une conversation guidée"],
  ["Mission", "Parler librement dans une situation réelle"],
  ["Mémoire", "Revoir uniquement ce qui risque d'être oublié"],
  ["Validation", "Prouver la compétence sans aide en français"],
];

const examTracks = [
  { id: "toeic", title: "TOEIC", target: "550 → 900+", focus: "Compréhension professionnelle et vitesse" },
  { id: "ielts", title: "IELTS", target: "Band 4 → 8", focus: "Speaking, listening et argumentation" },
  { id: "cambridge", title: "Cambridge", target: "B1 → C2", focus: "Maîtrise CECRL et examens oraux" },
];

const francophoneRules = [
  { id: "th-voiced", pattern: /\b(the|this|that|there|they|those|these|with)\b/i, sound: "/ð/", title: "Le TH sonore", tip: "Placez doucement la langue entre les dents. Faites vibrer la gorge : “ze” devient “the”.", drill: "the · this · those · with" },
  { id: "th-soft", pattern: /\b(think|thank|three|through|something|thing)\b/i, sound: "/θ/", title: "Le TH soufflé", tip: "Même position de langue, mais sans vibration. Laissez passer l'air, sans produire un S ni un F.", drill: "think · three · something" },
  { id: "h", pattern: /\b(have|hello|help|home|hotel|here|how|he|her)\b/i, sound: "/h/", title: "Le H aspiré", tip: "Commencez par un petit souffle. En anglais, le H s'entend : “home” ne commence pas par “ome”.", drill: "hello · have · home · help" },
  { id: "r", pattern: /\b(work|world|word|were|where|right|really|around)\b/i, sound: "/ɹ/", title: "Le R anglais", tip: "Ne roulez pas le R. Reculez légèrement la langue sans toucher le palais.", drill: "right · around · work · world" },
  { id: "vowels", pattern: /\b(live|leave|ship|sheep|this|these|sit|seat)\b/i, sound: "/ɪ/ ↔ /iː/", title: "Voyelle courte ou longue", tip: "La durée change le mot. Relâchez pour /ɪ/, souriez et allongez pour /iː/.", drill: "live / leave · ship / sheep" },
  { id: "stress", pattern: /\b(understand|expensive|opinion|presentation|interpretation|particularly|opportunity)\b/i, sound: "● ○ ○", title: "L'accent du mot", tip: "Une syllabe doit ressortir nettement. Les autres deviennent plus courtes et plus légères.", drill: "under-STAND · ex-PEN-sive · o-PI-nion" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("today");
  const [levelCode, setLevelCode] = useState<LevelCode>("A1");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("listen");
  const [completed, setCompleted] = useState<string[]>([]);
  const [translation, setTranslation] = useState(true);
  const [diagnostic, setDiagnostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<LevelCode | null>(null);
  const [timer, setTimer] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [episodeIndex, setEpisodeIndex] = useState(0);
  const [episodeLine, setEpisodeLine] = useState(0);
  const [episodePlaying, setEpisodePlaying] = useState(false);
  const [episodeSpeed, setEpisodeSpeed] = useState(0.85);
  const [episodeSubtitles, setEpisodeSubtitles] = useState(true);
  const [episodeAnswer, setEpisodeAnswer] = useState<string | null>(null);
  const [coachTab, setCoachTab] = useState<"mission" | "pronunciation" | "plan">("mission");
  const [learningGoal, setLearningGoal] = useState<"daily" | "work" | "travel" | "exam">("daily");
  const [dailyTarget, setDailyTarget] = useState(15);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [showGrammar, setShowGrammar] = useState(false);
  const [attempts, setAttempts] = useState<SpeechAttempt[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [episodeWins, setEpisodeWins] = useState<number[]>([]);
  const [accentRegion, setAccentRegion] = useState<AccentRegion>("france");
  const [targetAccent, setTargetAccent] = useState<TargetAccent>("uk");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<number[]>([]);
  const [selectedModule, setSelectedModule] = useState<{ level: LevelCode; index: number } | null>(null);
  const [examTrack, setExamTrack] = useState("toeic");
  const [commercialOpen, setCommercialOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [cloudStatus, setCloudStatus] = useState<"loading" | "synced" | "local">("loading");
  const [commercialMessage, setCommercialMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [landingOpen, setLandingOpen] = useState(true);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("app") === "1") setLandingOpen(false);
    if (new URLSearchParams(window.location.search).get("offre") === "premium") setCommercialOpen(true);
    const saved = window.localStorage.getItem("hello-curriculum-v2");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.levelCode) setLevelCode(data.levelCode);
      if (data.completed) setCompleted(data.completed);
      if (data.learningGoal) setLearningGoal(data.learningGoal);
      if (data.dailyTarget) setDailyTarget(data.dailyTarget);
      if (data.attempts) setAttempts(data.attempts);
      if (data.reviews) setReviews(data.reviews);
      if (data.episodeWins) setEpisodeWins(data.episodeWins);
      if (data.accentRegion) setAccentRegion(data.accentRegion);
      if (data.targetAccent) setTargetAccent(data.targetAccent);
      if (data.examTrack) setExamTrack(data.examTrack);
      if (data.selectedPlan) setSelectedPlan(data.selectedPlan);
      if (data.billingCycle) setBillingCycle(data.billingCycle);
    }
    fetch("/api/account").then(async (response) => {
      if (!response.ok) throw new Error("local");
      const cloud = await response.json();
      if (cloud.profile?.progress_json) {
        const data = JSON.parse(cloud.profile.progress_json);
        if (data.levelCode) setLevelCode(data.levelCode);
        if (data.completed) setCompleted(data.completed);
        if (data.attempts) setAttempts(data.attempts);
        if (data.reviews) setReviews(data.reviews);
        if (data.episodeWins) setEpisodeWins(data.episodeWins);
        if (cloud.profile.selected_plan) setSelectedPlan(cloud.profile.selected_plan);
        if (cloud.profile.billing_cycle) setBillingCycle(cloud.profile.billing_cycle);
      }
      setCloudStatus("synced");
    }).catch(() => setCloudStatus("local")).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const refreshVoices = () => setAvailableVoices(window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en")));
    refreshVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refreshVoices);
  }, []);

  useEffect(() => {
    const progress = { levelCode, completed, learningGoal, dailyTarget, attempts, reviews, episodeWins, accentRegion, targetAccent, examTrack, selectedPlan, billingCycle };
    window.localStorage.setItem("hello-curriculum-v2", JSON.stringify(progress));
    if (!hydrated) return;
    const id = window.setTimeout(() => fetch("/api/account", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ progress, selectedPlan, billingCycle }) }).then((response) => setCloudStatus(response.ok ? "synced" : "local")).catch(() => setCloudStatus("local")), 900);
    return () => window.clearTimeout(id);
  }, [levelCode, completed, learningGoal, dailyTarget, attempts, reviews, episodeWins, accentRegion, targetAccent, examTrack, selectedPlan, billingCycle, hydrated]);

  useEffect(() => {
    if (!timerRunning) return;
    if (timer <= 0) { setTimerRunning(false); return; }
    const id = window.setTimeout(() => setTimer((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timer, timerRunning]);

  useEffect(() => {
    if (!episodePlaying) return;
    const episode = episodes[episodeIndex];
    const line = episode.dialogue[episodeLine];
    const stop = speak(line.en, episodeSpeed, line.speaker === "Maya" ? 1.08 : 0.92, () => {
      if (episodeLine < episode.dialogue.length - 1) setEpisodeLine((value) => value + 1);
      else setEpisodePlaying(false);
    });
    return stop;
  }, [episodeIndex, episodeLine, episodePlaying, episodeSpeed]);

  const level = levels.find((item) => item.code === levelCode) ?? levels[0];
  const phrase = level.phrases[phraseIndex % level.phrases.length];
  const levelDone = completed.filter((item) => item.startsWith(`${levelCode}-`)).length;
  const totalPhrases = levels.reduce((sum, item) => sum + item.phrases.length, 0);
  const globalProgress = Math.round((completed.length / totalPhrases) * 100);
  const todayMinutes = 15;
  const episode = episodes[episodeIndex];
  const activeLine = episode.dialogue[episodeLine];
  const normalizedTarget = phrase.en.toLowerCase().replace(/[^a-z' ]/g, "").split(/\s+/).filter(Boolean);
  const normalizedSpoken = spokenText.toLowerCase().replace(/[^a-z' ]/g, "").split(/\s+/).filter(Boolean);
  const matchedWords = normalizedTarget.filter((word) => normalizedSpoken.includes(word)).length;
  const speechScore = spokenText ? Math.round((matchedWords / normalizedTarget.length) * 100) : 0;
  const activeRules = francophoneRules.filter((rule) => rule.pattern.test(phrase.en));
  const dueReviews = reviews.filter((item) => item.dueAt <= Date.now());
  const averageSpeechScore = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0;
  const listeningScore = Math.round((episodeWins.length / episodes.length) * 100);
  const productionScore = Math.min(100, completed.length * 4);
  const certificationScore = Math.round((averageSpeechScore + listeningScore + productionScore + 60) / 4);
  const moduleDetail = selectedModule ? levels.find((item) => item.code === selectedModule.level)?.modules[selectedModule.index] : null;
  const lessonContext = lessonContexts[levelCode];
  const rankedNativeVoices = useMemo(() => {
    const targetLanguage = targetAccent === "us" ? "en-US" : "en-GB";
    const qualityMarkers = ["natural", "neural", "premium", "enhanced", "google", "microsoft", "samantha", "daniel", "serena", "ava", "ryan"];
    return [...availableVoices].sort((a, b) => {
      const score = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase();
        let value = voice.lang.toLowerCase() === targetLanguage.toLowerCase() ? 60 : voice.lang.toLowerCase().startsWith(targetLanguage.slice(0, 2).toLowerCase()) ? 20 : 0;
        if (qualityMarkers.some((marker) => name.includes(marker))) value += 30;
        if (voice.localService) value += 5;
        return value;
      };
      return score(b) - score(a);
    });
  }, [availableVoices, targetAccent]);
  const selectedNativeVoice = rankedNativeVoices[0] ?? null;

  const dailyPrompt = useMemo(() => {
    const prompts: Record<LevelCode, string> = {
      A1: "Vous rencontrez un collègue pour la première fois. Saluez-le et présentez-vous.",
      A2: "Proposez à un ami de déjeuner demain et choisissez une heure.",
      B1: "Racontez un voyage mémorable et expliquez pourquoi vous l'avez aimé.",
      B2: "Présentez une idée de projet et répondez à une objection.",
      C1: "Nuancez votre opinion sur le travail à distance en donnant deux arguments.",
      C2: "Analysez une idée persuasive qui repose sur un raisonnement trompeur.",
    };
    return prompts[levelCode];
  }, [levelCode]);

  function audioId(text: string) {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function stopSpeaking() {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    window.speechSynthesis?.cancel();
  }

  function speak(text: string, rate = 0.82, pitch = 1, onEnd?: () => void) {
    if (!("speechSynthesis" in window)) return;
    stopSpeaking();
    const gender = pitch < 0.97 ? "male" : "female";
    const audio = new Audio(`/audio/${targetAccent}-${gender}/${audioId(text)}.mp3`);
    audio.preload = "auto";
    audio.playbackRate = Math.min(1.15, Math.max(0.65, rate));
    activeAudioRef.current = audio;
    let fallbackStarted = false;
    const fallback = () => {
      if (fallbackStarted) return;
      fallbackStarted = true;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetAccent === "us" ? "en-US" : "en-GB";
      const speakerVoice = pitch < 0.97 && rankedNativeVoices[1] ? rankedNativeVoices[1] : selectedNativeVoice;
      if (speakerVoice) utterance.voice = speakerVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.onend = () => onEnd?.();
      window.speechSynthesis.speak(utterance);
    };
    audio.onended = () => {
      if (activeAudioRef.current === audio) activeAudioRef.current = null;
      onEnd?.();
    };
    audio.onerror = fallback;
    audio.play().catch(fallback);
    return () => {
      audio.pause();
      if (activeAudioRef.current === audio) activeAudioRef.current = null;
    };
  }

  function nativeVoiceBar(text: string) {
    return <div className="native-voice-bar">
      <div><span>STUDIO NATIF · AUDIO NEURONAL</span><strong>{targetAccent === "uk" ? "Sonia & Ryan · anglais britannique" : "Jenny & Guy · anglais américain"}</strong></div>
      <div className="native-voice-actions" role="group" aria-label="Choisir l'accent du modèle">
        <button className={targetAccent === "uk" ? "active" : ""} onClick={() => setTargetAccent("uk")} aria-pressed={targetAccent === "uk"}>UK</button>
        <button className={targetAccent === "us" ? "active" : ""} onClick={() => setTargetAccent("us")} aria-pressed={targetAccent === "us"}>US</button>
        <button className="native-play" onClick={() => speak(text, 1)}>▶ Natif 1×</button>
      </div>
    </div>;
  }

  function selectEpisode(index: number) {
    stopSpeaking();
    setEpisodeIndex(index);
    setEpisodeLine(0);
    setEpisodePlaying(false);
    setEpisodeAnswer(null);
  }

  function toggleEpisode() {
    if (episodePlaying) {
      stopSpeaking();
      setEpisodePlaying(false);
      return;
    }
    if (episodeLine === episode.dialogue.length - 1) setEpisodeLine(0);
    setEpisodePlaying(true);
  }

  function startSpeechCoach() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechError("Le coaching vocal nécessite Chrome, Edge ou un navigateur compatible avec la reconnaissance vocale.");
      return;
    }
    setSpeechError("");
    setSpokenText("");
    const recognition = new Recognition();
    recognition.lang = targetAccent === "us" ? "en-US" : "en-GB";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => saveSpeechAttempt(event.results[0][0].transcript);
    recognition.onerror = () => setSpeechError("Je n'ai pas bien entendu. Approchez-vous du micro et réessayez.");
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }

  function saveSpeechAttempt(transcript: string) {
    setSpokenText(transcript);
    const targetWords = phrase.en.toLowerCase().replace(/[^a-z' ]/g, "").split(/\s+/).filter(Boolean);
    const heardWords = transcript.toLowerCase().replace(/[^a-z' ]/g, "").split(/\s+/).filter(Boolean);
    const weakWords = targetWords.filter((word) => !heardWords.includes(word));
    const score = Math.round(((targetWords.length - weakWords.length) / targetWords.length) * 100);
    const now = Date.now();
    setAttempts((items) => [{ id: `${now}`, level: levelCode, phrase: phrase.en, score, weakWords, createdAt: now }, ...items].slice(0, 40));
    const delay = score >= 85 ? 3 * 86400000 : score >= 60 ? 86400000 : 10 * 60000;
    const review: ReviewItem = { id: `${levelCode}-${phraseIndex}`, level: levelCode, phraseIndex, phrase: phrase.en, dueAt: now + delay, reason: weakWords.length ? `Retravailler : ${weakWords.slice(0, 3).join(", ")}` : "Consolider la fluidité" };
    setReviews((items) => [review, ...items.filter((item) => item.id !== review.id)].slice(0, 20));
  }

  function startReview(item: ReviewItem) {
    setLevelCode(item.level);
    setPhraseIndex(item.phraseIndex);
    setPracticeMode("recall");
    setTranslation(false);
    setScreen("lesson");
    setReviews((items) => items.filter((review) => review.id !== item.id));
  }

  function openLesson(mode: PracticeMode = "listen") {
    setPracticeMode(mode);
    setTranslation(mode === "listen");
    setScreen("lesson");
  }

  function finishPhrase() {
    const key = `${levelCode}-${phraseIndex % level.phrases.length}`;
    setCompleted((items) => Array.from(new Set([...items, key])));
    setPhraseIndex((value) => (value + 1) % level.phrases.length);
    setPracticeMode("listen");
    setTranslation(true);
  }

  function chooseLevel(code: LevelCode) {
    setLevelCode(code);
    setPhraseIndex(0);
    setScreen("today");
  }

  function runDiagnostic(result: LevelCode) {
    setDiagnosticResult(result);
  }

  function answerDiagnostic(choice: number) {
    const nextAnswers = [...diagnosticAnswers, choice];
    setDiagnosticAnswers(nextAnswers);
    if (diagnosticStep < diagnosticQuestions.length - 1) {
      setDiagnosticStep((value) => value + 1);
      return;
    }
    const correct = nextAnswers.reduce((sum, answer, index) => sum + (answer === diagnosticQuestions[index].answer ? 1 : 0), 0);
    const result: LevelCode = correct <= 1 ? "A1" : correct <= 3 ? "A2" : correct <= 4 ? "B1" : correct <= 5 ? "B2" : correct <= 6 ? "C1" : "C2";
    runDiagnostic(result);
  }

  function resetDiagnostic() {
    setDiagnosticStep(0);
    setDiagnosticAnswers([]);
    setDiagnosticResult(null);
  }

  function applyDiagnostic() {
    if (diagnosticResult) chooseLevel(diagnosticResult);
    setDiagnostic(false);
    resetDiagnostic();
  }

  function exportProgress() {
    const data = window.localStorage.getItem("hello-curriculum-v2") ?? "{}";
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hello-progression-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function requestPremium() {
    setSelectedPlan("premium");
    const progress = { levelCode, completed, learningGoal, dailyTarget, attempts, reviews, episodeWins, accentRegion, targetAccent, examTrack, selectedPlan: "premium", billingCycle };
    try {
      const response = await fetch("/api/account", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ progress, selectedPlan: "premium", billingCycle, registerInterest: true }) });
      if (!response.ok) throw new Error("save");
      setCommercialMessage("Votre accès prioritaire est réservé. Aucun paiement n'a été prélevé.");
      setCloudStatus("synced");
    } catch {
      setCommercialMessage("Votre choix est enregistré sur cet appareil. Aucun paiement n'a été prélevé.");
    }
  }

  if (landingOpen) return (
    <main className="brand-landing">
      <header className="landing-nav">
        <button className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span>H</span><strong>Hello!</strong><small>ENGLISH, SPOKEN.</small></button>
        <nav aria-label="Navigation de présentation"><a href="#methode">Méthode</a><a href="#programme">Programme</a><a href="#offres">Tarifs</a></nav>
        <div><a className="login-link" href="/account">Se connecter</a><button onClick={() => setLandingOpen(false)}>Commencer</button></div>
      </header>

      <section className="landing-hero">
        <div className="hero-brand-copy">
          <span className="brand-pill">CONÇU POUR LES FRANCOPHONES</span>
          <h1>Vous n’avez pas besoin de plus de théorie.<br /><em>Vous avez besoin de parler.</em></h1>
          <p>Hello! transforme 15 minutes par jour en réflexes utiles : écouter, répéter, répondre et retenir — du niveau A1 au C2.</p>
          <div className="hero-ctas"><button onClick={() => setLandingOpen(false)}>Commencer gratuitement <span>→</span></button><button className="watch-method" onClick={() => document.getElementById("methode")?.scrollIntoView({ behavior: "smooth" })}><span>▶</span> Voir la méthode</button></div>
          <small className="no-card">Sans carte bancaire · Diagnostic inclus · Annulation libre</small>
        </div>
        <div className="hero-product" aria-label="Aperçu de l'application Hello!">
          <div className="product-orbit orbit-one" /><div className="product-orbit orbit-two" />
          <article className="product-phone">
            <div className="phone-top"><span className="mini-logo">H</span><b>Votre mission</b><small>12:24</small></div>
            <p className="eyebrow">A2 · AUJOURD'HUI</p><h2>Commander avec confiance.</h2>
            <div className="phone-phrase"><button>▶</button><strong>Could I have a coffee, please?</strong><small>Écoutez, puis répondez sans lire.</small></div>
            <div className="phone-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <button className="phone-action">À vous de parler</button>
          </article>
          <div className="floating-proof proof-score"><span>Clarté</span><strong>92<small>/100</small></strong></div>
          <div className="floating-proof proof-review"><span>↻</span><p><strong>Révision prête</strong><small>Au bon moment, pas au hasard.</small></p></div>
        </div>
      </section>

      <section className="brand-proofbar"><div><strong>24</strong><span>expressions disponibles</span></div><div><strong>UK + US</strong><span>deux accents natifs</span></div><div><strong>15 min</strong><span>par jour</span></div><div><strong>6</strong><span>épisodes interactifs</span></div></section>
      <div className="brand-marquee" aria-hidden="true"><span>LISTEN</span><i>●</i><span>SPEAK</span><i>●</i><span>CORRECT</span><i>●</i><span>REMEMBER</span><i>●</i><span>HELLO!</span></div>

      <section className="problem-section">
        <p className="eyebrow">LE PROBLÈME N'EST PAS VOTRE MÉMOIRE</p>
        <h2>Vous avez appris l’anglais.<br />Mais on ne vous a pas appris à <em>le parler.</em></h2>
        <div className="problem-grid"><article><span>01</span><h3>Trop de règles</h3><p>Vous connaissez la grammaire, mais la phrase n’arrive pas au bon moment.</p></article><article><span>02</span><h3>Pas assez d’oreille</h3><p>Vous comprenez les textes, puis perdez le fil dès que les natifs parlent.</p></article><article><span>03</span><h3>La peur de l’accent</h3><p>Vous cherchez la perfection au lieu de rendre votre message clair.</p></article></div>
      </section>

      <section className="outcome-gallery">
        <article className="outcome-work"><span className="outcome-index">01 / WORK</span><div className="outcome-art"><b>“</b><p>Let me walk you<br />through the idea.</p><i>↗</i></div><h3>Prendre la parole au travail.</h3><p>Réunions, présentations, désaccords et négociations — avec le bon registre.</p></article>
        <article className="outcome-travel"><span className="outcome-index">02 / TRAVEL</span><div className="outcome-art"><b>→</b><p>Where does<br />this train stop?</p><i>07:42</i></div><h3>Voyager sans dépendre du français.</h3><p>Comprendre les annonces, résoudre un imprévu et créer un vrai contact.</p></article>
        <article className="outcome-life"><span className="outcome-index">03 / DAILY LIFE</span><div className="outcome-art"><b>◉</b><p>Tell me more<br />about that.</p><i>92</i></div><h3>Faire durer la conversation.</h3><p>Répondre naturellement, relancer et raconter sans traduire chaque pensée.</p></article>
      </section>

      <section className="method-section" id="methode">
        <div className="method-intro"><p className="eyebrow">MÉTHODE C.L.A.I.R.</p><h2>Cinq leviers.<br />Une langue vivante.</h2><p>Chaque séance relie contexte, sens, rappel actif, conversation et répétition espacée. Vous comprenez la règle au moment exact où elle devient utile.</p></div>
        <div className="brand-method-grid clair-grid">{clairMethod.map((item, index) => <article key={item.letter} className={index === 3 ? "featured" : ""}><span>0{index + 1}</span><div className="method-symbol">{item.letter}</div><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      </section>

      <section className="francophone-section">
        <div className="sound-display"><span>TH</span><span>R</span><span>H</span><div className="sound-line" /></div>
        <div><p className="eyebrow">NOTRE DIFFÉRENCE</p><h2>Un coach qui comprend d’où vient votre accent.</h2><p>Hello! cible les difficultés communes aux francophones : le TH, le H aspiré, le R anglais, les voyelles longues et le rythme. L’objectif n’est pas d’effacer votre accent, mais d’être compris immédiatement.</p><ul><li>Correction mot par mot</li><li>Exercices ciblés selon la phrase</li><li>Score d’intelligibilité, pas de perfection</li></ul></div>
      </section>

      <section className="curriculum-section" id="programme">
        <div className="section-brand-heading"><div><p className="eyebrow">UN PARCOURS, PAS UN CATALOGUE</p><h2>De vos premiers mots<br />à votre voix personnelle.</h2></div><p>Une feuille de route de 36 modules du niveau A1 au C2. La bêta fondatrice ouvre aujourd’hui 24 expressions guidées et s’enrichit progressivement.</p></div>
        <div className="brand-levels">{levels.map((item,index) => <article key={item.code} style={{ "--brand-level": item.color } as React.CSSProperties}><span>{item.code}</span><small>ÉTAPE {index + 1}</small><h3>{item.name}</h3><p>{item.promise}</p><b>{item.modules.reduce((sum,module) => sum + module.sessions,0)} séances</b></article>)}</div>
      </section>

      <section className="series-brand-section"><div><p className="eyebrow">APPRENDRE PAR LES HISTOIRES</p><h2>Une mini-série que vous finissez par comprendre sans sous-titres.</h2><p>Maya et Leo vivent les situations que vous rencontrerez : café, voyage, travail, désaccord et projets. Écoutez, rejouez les scènes, puis prenez leur place.</p><button onClick={() => { setLandingOpen(false); setScreen("series"); }}>Voir les épisodes <span>→</span></button></div><div className="series-poster"><span>HELLO! ORIGINAL</span><strong>MAYA<br />& LEO</strong><small>SAISON 01 · 6 ÉPISODES</small><i>▶</i></div></section>

      <section className="pricing-brand-section" id="offres">
        <p className="eyebrow">COMMENCEZ SANS RISQUE</p><h2>Moins qu’un café par semaine.<br />Plus de phrases chaque jour.</h2>
        <div className="landing-prices"><article><span>DÉCOUVERTE</span><h3>Gratuit</h3><strong>0 €</strong><p>Pour tester la méthode sans engagement.</p><ul><li>Diagnostic indicatif</li><li>24 expressions guidées</li><li>Accents britannique et américain</li><li>6 épisodes et quiz</li></ul><button onClick={() => setLandingOpen(false)}>Commencer</button></article><article className="price-premium"><span>BÊTA FONDATRICE</span><h3>Accès prioritaire</h3><strong>0 €<small> aujourd’hui</small></strong><p>Participez avant l’ouverture de l’offre payante.</p><ul><li>Tout l’accès Découverte</li><li>Progression synchronisée</li><li>Nouveaux modules en avant-première</li><li>Tarif Fondateur annoncé avant achat</li></ul><button onClick={() => { setLandingOpen(false); setCommercialOpen(true); }}>Rejoindre la bêta</button></article></div>
        <div className="landing-guarantees"><span>✓ Aucun paiement aujourd’hui</span><span>✓ Promesses transparentes</span><span>✓ Progression exportable</span></div>
      </section>

      <section className="landing-faq"><p className="eyebrow">QUESTIONS FRÉQUENTES</p><h2>Avant de commencer.</h2>{[
        ["Est-ce adapté si je débute complètement ?","Oui. Le diagnostic vous place au bon niveau et le parcours A1 commence par les besoins les plus immédiats."],
        ["Dois-je avoir un bon accent ?","Non. Le coach travaille l’intelligibilité : être compris clairement, sans renier votre identité."],
        ["Combien de temps faut-il par jour ?","Dix à quinze minutes suffisent si vous pratiquez régulièrement et répondez réellement à voix haute."],
        ["Puis-je utiliser Hello! sur mon téléphone ?","Oui. L’expérience est conçue d’abord pour mobile et votre progression est liée à votre compte."],
      ].map(([question,answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</section>

      <section className="closing-brand"><span className="closing-mark">H</span><p className="eyebrow">YOUR VOICE. YOUR ENGLISH.</p><h2>Le meilleur moment pour parler anglais,<br />c’était hier. Le deuxième, c’est maintenant.</h2><button onClick={() => setLandingOpen(false)}>Commencer gratuitement <span>→</span></button></section>
      <footer className="landing-footer"><div><strong>Hello!</strong><small>English, spoken.</small></div><p>Une méthode d’anglais pensée pour les francophones.</p><nav><a href="/account">Compte</a><a href="/confidentialite">Confidentialité</a><a href="/conditions">Conditions</a><a href="/assistance">Assistance</a></nav><span>© 2026 Hello!</span></footer>
    </main>
  );

  return (
    <main className="app-shell" style={{ "--level": level.color } as React.CSSProperties}>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("today")} aria-label="Retour à l'accueil">
          <span className="brand-mark">H</span><span>Hello!</span>
        </button>
        <button className="level-chip" onClick={() => setScreen("path")} aria-label={`Niveau actuel ${levelCode}`}>
          <b>{levelCode}</b><span>{level.name}</span>
        </button>
        <a className="avatar" aria-label="Ouvrir mon compte" href="/account">S</a>
      </header>

      {screen === "today" && (
        <section className="screen today-screen">
          <div className="hero-copy">
            <div>
              <p className="eyebrow">VOTRE ANGLAIS · JOUR 4</p>
              <h1>Parlez un peu.<br /><em>Tous les jours.</em></h1>
            </div>
            <div className="streak-orbit"><strong>4</strong><span>jours</span></div>
          </div>

          <article className="daily-card">
            <div className="daily-card-head">
              <span className="pill">MISSION ADAPTATIVE</span>
              <span>{todayMinutes} MIN</span>
            </div>
            <p className="card-kicker">{levelCode} · {level.name.toUpperCase()}</p>
            <h2>{level.modules[0].title}</h2>
            <p className="card-copy">Votre mission combine une phrase nouvelle, une révision et une réponse orale adaptée à votre niveau.</p>
            <div className="mini-method">
              {method.map((item, index) => <span key={item.mode} className={index === 0 ? "current" : ""}>{item.icon}</span>)}
              <i />
              <small>Écouter → parler</small>
            </div>
            <button className="primary light" onClick={() => openLesson()}>
              Commencer maintenant <span>→</span>
            </button>
          </article>

          <div className="proof-strip">
            <span><b>1</b><small>à comprendre</small></span><i /><span><b>{Math.max(1, levelDone)}</b><small>à réviser</small></span><i /><span><b>1 min</b><small>à parler</small></span>
          </div>

          <article className="academy-proof">
            <div><strong>24</strong><span>expressions disponibles</span></div>
            <div><strong>36</strong><span>modules CECRL</span></div>
            <div><strong>6</strong><span>niveaux dans la feuille de route</span></div>
          </article>

          <button className="premium-teaser" onClick={() => setCommercialOpen(true)}>
            <span className="premium-monogram">H+</span>
            <span><small>BÊTA FONDATRICE</small><strong>Construisez la suite avec nous.</strong><em>Accès prioritaire · aucun paiement aujourd’hui</em></span>
            <b>Participer →</b>
          </button>

          <article className="adaptive-queue">
            <div className="queue-head"><span>↻</span><div><p className="eyebrow">MÉMOIRE ADAPTATIVE</p><h2>{dueReviews.length ? `${dueReviews.length} révision${dueReviews.length > 1 ? "s" : ""} prête${dueReviews.length > 1 ? "s" : ""}` : reviews.length ? "Votre mémoire travaille" : "La première révision se prépare"}</h2></div></div>
            {dueReviews.length ? dueReviews.slice(0, 2).map((item) => <button key={item.id} onClick={() => startReview(item)}><span><strong>{item.phrase}</strong><small>{item.reason}</small></span><b>Réviser →</b></button>) : <p>{reviews.length ? "La prochaine phrase reviendra au moment où vous risquez de l'oublier." : "Après votre première tentative vocale, le coach programmera les rappels selon votre score."}</p>}
          </article>

          <div className="section-title">
            <div><p className="eyebrow">MÉTHODE C.L.A.I.R. · 15 MINUTES</p><h2>Du contexte à la conversation.</h2></div>
          </div>
          <div className="clair-compact">{clairMethod.map((item) => <span key={item.letter}><b>{item.letter}</b><small>{item.title}</small></span>)}</div>
          <div className="method-grid">
            {method.map((item) => (
              <button key={item.mode} onClick={() => openLesson(item.mode)}>
                <span className="step-number">{item.icon}</span>
                <span><strong>{item.label}</strong><small>{item.text}</small></span>
                <b>{item.time}</b>
              </button>
            ))}
          </div>

          <button className="series-teaser" onClick={() => setScreen("series")}>
            <span className="teaser-visual"><i>▶</i><b>EP. 01</b></span>
            <span><small>MINI-SÉRIE · NOUVEAU</small><strong>Écoutez l'anglais en situation.</strong><em>Dialogues, sous-titres et quiz</em></span>
            <b>→</b>
          </button>

          <button className="diagnostic-banner" onClick={() => setDiagnostic(true)}>
            <span>?</span><span><strong>Vous connaissez déjà l'anglais ?</strong><small>Bilan adaptatif · 8 questions</small></span><b>→</b>
          </button>
        </section>
      )}

      {screen === "path" && (
        <section className="screen path-screen">
          <div className="page-heading">
            <p className="eyebrow">PARCOURS COMPLET</p>
            <h1>De vos premiers mots<br />à la maîtrise.</h1>
            <p>Choisissez votre point de départ. Vous pouvez changer de niveau à tout moment.</p>
          </div>
          <div className="level-rail">
            {levels.map((item, index) => {
              const active = item.code === levelCode;
              const done = completed.filter((entry) => entry.startsWith(`${item.code}-`)).length;
              return (
                <article key={item.code} className={`level-card ${active ? "active" : ""}`} style={{ "--card-level": item.color } as React.CSSProperties}>
                  <button className="level-main" onClick={() => chooseLevel(item.code)}>
                    <span className="level-badge">{item.code}</span>
                    <span className="level-info"><small>ÉTAPE {index + 1} · {item.duration}</small><strong>{item.name}</strong><em>{item.promise}</em></span>
                    <span className="level-state">{active ? "En cours" : done ? `${done}/4` : "Choisir"}</span>
                  </button>
                  {active && (
                    <div className="module-list">
                      {item.modules.map((module) => (
                        <button key={module.title} onClick={() => setSelectedModule({ level: item.code, index: item.modules.indexOf(module) })}>
                          <span>{module.icon}</span><span><strong>{module.title}</strong><small>{module.goal} · {module.sessions} sessions</small></span><b>→</b>
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <section className="exam-paths">
            <div className="content-heading"><div><p className="eyebrow">PARCOURS OBJECTIF</p><h2>Préparer une preuve reconnue</h2></div><span>Inclus</span></div>
            <div className="exam-grid">{examTracks.map((track) => <button className={examTrack === track.id ? "active" : ""} key={track.id} onClick={() => { setExamTrack(track.id); setLearningGoal("exam"); }}><span>{examTrack === track.id ? "✓" : "○"}</span><strong>{track.title}</strong><b>{track.target}</b><small>{track.focus}</small></button>)}</div>
            <p>Le coach donne la priorité au vocabulaire, aux contraintes de temps et aux tâches orales de l'examen choisi.</p>
          </section>
        </section>
      )}

      {screen === "lesson" && (
        <section className="screen lesson-screen">
          <div className="lesson-top">
            <button className="back" onClick={() => setScreen("today")} aria-label="Quitter la session">←</button>
            <div className="lesson-progress"><span style={{ width: `${((phraseIndex + 1) / level.phrases.length) * 100}%` }} /></div>
            <span className="lesson-step">{phraseIndex + 1}/{level.phrases.length}</span>
          </div>
          <div className="mode-tabs" role="tablist" aria-label="Étapes de la méthode">
            {method.map((item) => <button key={item.mode} className={practiceMode === item.mode ? "active" : ""} onClick={() => { setPracticeMode(item.mode); setTranslation(item.mode === "listen"); }}>{item.icon}<span>{item.label}</span></button>)}
          </div>
          <div className="lesson-heading">
            <p className="eyebrow">{levelCode} · {method.find((item) => item.mode === practiceMode)?.time}</p>
            <h1>{practiceMode === "listen" ? "Écoutez le rythme." : practiceMode === "shadow" ? "Parlez avec la voix." : practiceMode === "recall" ? "Retrouvez la phrase." : "À vous de répondre."}</h1>
          </div>

          {nativeVoiceBar(practiceMode === "roleplay" ? phrase.reply : phrase.en)}

          <article className="lesson-context-card">
            <div><span>CONTEXTE</span><strong>{lessonContext.scene}</strong></div>
            <div><span>INTENTION</span><strong>{lessonContext.intention}</strong></div>
            <p><b>Rendez-la personnelle</b>{lessonContext.personal}</p>
          </article>

          <article className={`phrase-card mode-${practiceMode}`}>
            {practiceMode === "roleplay" && <div className="role-cue"><span>INTERLOCUTEUR</span><p>{phrase.reply}</p></div>}
            <button className="sound-button" onClick={() => speak(practiceMode === "roleplay" ? phrase.reply : phrase.en, practiceMode === "shadow" ? 0.7 : 0.82)} aria-label="Écouter la phrase">▶</button>
            <p className={`english ${practiceMode === "recall" && !translation ? "hidden-phrase" : ""}`}>{practiceMode === "recall" && !translation ? "À vous de la retrouver…" : phrase.en}</p>
            {practiceMode !== "roleplay" && <p className="pronunciation">{phrase.hint}</p>}
            <button className="translation" onClick={() => setTranslation((value) => !value)}>{translation ? phrase.fr : "Voir l'aide"}</button>
            {practiceMode === "shadow" && <div className="shadow-tip">Conseil : lancez l'audio et commencez à parler une demi-seconde après.</div>}
            {practiceMode === "roleplay" && <div className="your-turn">Votre réponse <span>Utilisez la phrase ci-dessus, puis ajoutez un détail.</span></div>}
            <div className="wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </article>
          <button className="explain-toggle" onClick={() => setShowGrammar((value) => !value)}><span>?</span><span><strong>Comprendre, pas mémoriser au hasard</strong><small>{showGrammar ? "Masquer l'explication" : "Pourquoi dit-on cette phrase ?"}</small></span><b>{showGrammar ? "−" : "+"}</b></button>
          {showGrammar && <article className="grammar-card"><p className="eyebrow">EXPLICATION SIMPLE</p><h2>{grammarNotes[levelCode].title}</h2><p>{grammarNotes[levelCode].explanation}</p><code>{grammarNotes[levelCode].formula}</code></article>}
          <div className="lesson-actions">
            <button className="secondary" onClick={() => speak(phrase.en, 0.65)}>Écouter lentement</button>
            <button className="primary" onClick={practiceMode === "roleplay" ? finishPhrase : () => setPracticeMode(method[Math.min(method.findIndex((item) => item.mode === practiceMode) + 1, 3)].mode)}>
              {practiceMode === "roleplay" ? "Phrase acquise" : "Étape suivante"} <span>→</span>
            </button>
          </div>
        </section>
      )}

      {screen === "series" && (
        <section className="screen series-screen">
          <div className="page-heading series-heading">
            <p className="eyebrow">MINI-SÉRIE · 6 ÉPISODES</p>
            <h1>La vie de Maya<br />et Leo.</h1>
            <p>Écoutez d'abord sans lire, puis activez les sous-titres et vérifiez votre compréhension.</p>
          </div>

          <div className="episode-strip" aria-label="Liste des épisodes">
            {episodes.map((item, index) => (
              <button key={item.number} className={episodeIndex === index ? "active" : ""} onClick={() => selectEpisode(index)}>
                <span>{item.number}</span><b>{item.level}</b><small>{item.title}</small>
              </button>
            ))}
          </div>

          <article className="video-player">
            <div className="video-scene">
              <div className="scene-top"><span>ÉPISODE {String(episode.number).padStart(2, "0")}</span><span>{episode.place}</span></div>
              <div className="characters" aria-hidden="true">
                <div className={`character maya ${activeLine.speaker === "Maya" && episodePlaying ? "talking" : ""}`}><span>M</span><b>Maya</b></div>
                <div className="scene-prop"><i /><i /><i /></div>
                <div className={`character leo ${activeLine.speaker === "Leo" && episodePlaying ? "talking" : ""}`}><span>L</span><b>Leo</b></div>
              </div>
              <div className="subtitle-box">
                <strong>{activeLine.speaker}</strong>
                <p>{activeLine.en}</p>
                {episodeSubtitles && <small>{activeLine.fr}</small>}
              </div>
              <div className="video-progress"><span style={{ width: `${((episodeLine + (episodePlaying ? .45 : 0)) / episode.dialogue.length) * 100}%` }} /></div>
            </div>
            <div className="video-controls">
              <button onClick={() => setEpisodeLine((value) => Math.max(0, value - 1))} aria-label="Réplique précédente">‹</button>
              <button className="play-main" onClick={toggleEpisode} aria-label={episodePlaying ? "Mettre en pause" : "Lire l'épisode"}>{episodePlaying ? "Ⅱ" : "▶"}</button>
              <button onClick={() => setEpisodeLine((value) => Math.min(episode.dialogue.length - 1, value + 1))} aria-label="Réplique suivante">›</button>
              <button className={episodeSubtitles ? "control-active" : ""} onClick={() => setEpisodeSubtitles((value) => !value)}>CC</button>
              <button onClick={() => setEpisodeSpeed((value) => value === 0.7 ? 0.85 : value === 0.85 ? 1 : 0.7)}>{episodeSpeed}×</button>
            </div>
          </article>

          {nativeVoiceBar(activeLine.en)}

          <div className="episode-intro">
            <div><p className="eyebrow">ÉPISODE {episode.number} · {episode.duration}</p><h2>{episode.title}</h2></div>
            <span className="episode-level">{episode.level}</span>
            <p>{episode.synopsis}</p>
          </div>

          <section className="transcript-card">
            <div className="content-heading"><div><p className="eyebrow">TRANSCRIPTION</p><h2>Suivez le dialogue</h2></div><button onClick={() => speak(activeLine.en, 0.7, activeLine.speaker === "Maya" ? 1.08 : 0.92)}>↻ Réécouter</button></div>
            <div className="transcript-lines">
              {episode.dialogue.map((line, index) => (
                <button className={episodeLine === index ? "active" : ""} key={`${line.speaker}-${index}`} onClick={() => { setEpisodeLine(index); setEpisodePlaying(false); speak(line.en, episodeSpeed, line.speaker === "Maya" ? 1.08 : 0.92); }}>
                  <span className={line.speaker.toLowerCase()}>{line.speaker[0]}</span><span><strong>{line.speaker}</strong><p>{line.en}</p><small>{line.fr}</small></span>
                </button>
              ))}
            </div>
          </section>

          <section className="vocab-card">
            <div className="content-heading"><div><p className="eyebrow">À RETENIR</p><h2>3 expressions utiles</h2></div></div>
            <div className="vocab-list">{episode.vocabulary.map((item) => <button key={item.word} onClick={() => speak(item.word, 0.72)}><span>▶</span><strong>{item.word}</strong><small>{item.meaning}</small></button>)}</div>
          </section>

          <section className="episode-quiz">
            <p className="eyebrow">COMPRÉHENSION</p><h2>{episode.question}</h2>
            <div>{episode.choices.map((choice) => {
              const chosen = episodeAnswer === choice;
              const state = chosen ? (choice === episode.answer ? "correct" : "wrong") : "";
              return <button className={state} key={choice} onClick={() => { setEpisodeAnswer(choice); if (choice === episode.answer) setEpisodeWins((items) => Array.from(new Set([...items, episode.number]))); }}>{choice}<span>{chosen ? (choice === episode.answer ? "✓" : "×") : "○"}</span></button>;
            })}</div>
            {episodeAnswer && <p className={episodeAnswer === episode.answer ? "quiz-feedback correct" : "quiz-feedback"}>{episodeAnswer === episode.answer ? "Bien compris ! Passez à l'épisode suivant." : "Réécoutez la scène et cherchez l'information clé."}</p>}
          </section>
        </section>
      )}

      {screen === "speak" && (
        <section className="screen speak-screen">
          <div className="page-heading">
            <p className="eyebrow">COACH PERSONNEL · {levelCode}</p>
            <h1>Votre voix guide<br />la prochaine leçon.</h1>
            <p>Entraînez la fluidité, mesurez votre intelligibilité et adaptez le parcours à votre objectif réel.</p>
          </div>
          <div className="coach-tabs" role="tablist" aria-label="Outils du coach">
            <button className={coachTab === "mission" ? "active" : ""} onClick={() => setCoachTab("mission")}>Mission</button>
            <button className={coachTab === "pronunciation" ? "active" : ""} onClick={() => setCoachTab("pronunciation")}>Prononciation</button>
            <button className={coachTab === "plan" ? "active" : ""} onClick={() => setCoachTab("plan")}>Mon plan</button>
          </div>

          {coachTab === "mission" && <>
            <article className="speak-card">
              <div className={`timer ${timerRunning ? "running" : ""}`}><strong>{String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}</strong><span>{timer === 0 ? "Terminé !" : timerRunning ? "Continuez…" : "Prêt ?"}</span></div>
              <p className="scenario-label">MISSION POUR VOUS</p>
              <h2>{dailyPrompt}</h2>
              <div className="prompt-help"><span>AMORCE UTILE</span><button onClick={() => speak(phrase.en)}>▶ {phrase.en}</button></div>
              <button className="primary" onClick={() => { if (timer === 0) setTimer(60); setTimerRunning((value) => !value); }}>{timerRunning ? "Mettre en pause" : timer === 0 ? "Recommencer" : "Démarrer la minute"}</button>
            </article>
            <div className="confidence-note"><span>◎</span><p><strong>La règle de fluidité</strong>Si un mot vous manque, contournez-le avec des mots simples. Ne repassez pas au français.</p></div>
          </>}

          {coachTab === "pronunciation" && <article className="pronunciation-lab">
            <div className="lab-head"><span className="lab-badge">BÊTA</span><p>Le score mesure les mots reconnus et l'intelligibilité, pas votre accent.</p></div>
            <button className="listen-model" onClick={() => speak(phrase.en, 0.78)}>▶ <span><small>ÉCOUTER LE MODÈLE</small><strong>{phrase.en}</strong></span></button>
            {nativeVoiceBar(phrase.en)}
            <div className="target-words" aria-label="Phrase à prononcer">{phrase.en.split(" ").map((word, index) => {
              const normalized = word.toLowerCase().replace(/[^a-z']/g, "");
              const heard = normalizedSpoken.includes(normalized);
              return <span className={spokenText ? (heard ? "heard" : "missed") : ""} key={`${word}-${index}`}>{word}</span>;
            })}</div>
            <button className={`record-button ${isListening ? "recording" : ""}`} onClick={startSpeechCoach} disabled={isListening}><span>●</span>{isListening ? "Je vous écoute…" : spokenText ? "Réessayer" : "Prononcer la phrase"}</button>
            {speechError && <p className="speech-error">{speechError}</p>}
            {spokenText && <div className="speech-result">
              <div className="score-orb" style={{ "--score": `${speechScore * 3.6}deg` } as React.CSSProperties}><strong>{speechScore}</strong><small>/100</small></div>
              <div><p className="eyebrow">J'AI ENTENDU</p><h3>“{spokenText}”</h3><p>{speechScore >= 85 ? "Très clair. Le message serait compris immédiatement." : speechScore >= 60 ? "Le message passe. Retravaillez seulement les mots en corail." : "Ralentissez et découpez la phrase en deux groupes de sens."}</p></div>
            </div>}
            <div className="francophone-focus">
              <div><p className="eyebrow">FOCUS FRANCOPHONE</p><h3>{activeRules.length ? `${activeRules.length} point${activeRules.length > 1 ? "s" : ""} dans cette phrase` : "Rythme et enchaînement"}</h3></div>
              {(activeRules.length ? activeRules : [{ id: "rhythm", sound: "↗ ↘", title: "Le rythme anglais", tip: "Accentuez les mots importants et réduisez les petits mots. La phrase devient plus naturelle sans parler plus vite.", drill: "Mots forts · petits mots légers" }]).map((rule) => <details key={rule.id}><summary><span>{rule.sound}</span><strong>{rule.title}</strong><b>+</b></summary><p>{rule.tip}</p><button onClick={() => speak(rule.drill, 0.68)}>▶ {rule.drill}</button></details>)}
            </div>
            <div className="coach-tip"><b>Conseil du coach</b><span>Ne cherchez pas un accent parfait. Accentuez les mots importants et gardez un rythme régulier.</span></div>
          </article>}

          {coachTab === "plan" && <article className="plan-card">
            <p className="eyebrow">OBJECTIF PRIORITAIRE</p><h2>Pourquoi apprenez-vous ?</h2>
            <div className="goal-options">{[
              ["daily","Vie quotidienne","Discuter naturellement"], ["work","Travail","Réunions et carrière"], ["travel","Voyage","Se débrouiller partout"], ["exam","Examen","Structurer et réussir"],
            ].map(([value,title,copy]) => <button className={learningGoal === value ? "active" : ""} key={value} onClick={() => setLearningGoal(value as typeof learningGoal)}><span>{learningGoal === value ? "✓" : "○"}</span><strong>{title}</strong><small>{copy}</small></button>)}</div>
            <p className="eyebrow time-label">TEMPS DISPONIBLE PAR JOUR</p>
            <div className="time-options">{[10,15,25].map((minutes) => <button className={dailyTarget === minutes ? "active" : ""} key={minutes} onClick={() => setDailyTarget(minutes)}><strong>{minutes}</strong><small>min</small></button>)}</div>
            <p className="eyebrow time-label">VOTRE FRANÇAIS</p>
            <div className="region-options">{[
              ["france","France"], ["maghreb","Maghreb"], ["africa","Afrique francophone"], ["canada","Canada"], ["europe","Belgique / Suisse"],
            ].map(([value,label]) => <button className={accentRegion === value ? "active" : ""} key={value} onClick={() => setAccentRegion(value as AccentRegion)}>{label}</button>)}</div>
            <div className="plan-summary"><span>Votre plan</span><strong>{dailyTarget} min · {learningGoal === "daily" ? "anglais quotidien" : learningGoal === "work" ? "anglais professionnel" : learningGoal === "travel" ? "anglais de voyage" : "préparation examen"}</strong><small>Le contenu prioritaire s'ajuste dès la prochaine mission.</small></div>
          </article>}
        </section>
      )}

      {screen === "progress" && (
        <section className="screen progress-screen">
          <div className="page-heading centered">
            <p className="eyebrow">VOTRE PROGRESSION</p>
            <h1>La régularité<br />fait la différence.</h1>
          </div>
          <div className="progress-ring" style={{ "--progress": `${globalProgress * 3.6}deg` } as React.CSSProperties}><span>{globalProgress}%<small>du parcours exploré</small></span></div>
          <div className="stats">
            <div><strong>{completed.length}</strong><span>phrases maîtrisées</span></div>
            <div><strong>4</strong><span>jours consécutifs</span></div>
            <div><strong>{levelCode}</strong><span>niveau actuel</span></div>
          </div>
          <article className="weekly-card">
            <div><p className="eyebrow">CETTE SEMAINE</p><h2>3 jours sur 5</h2></div>
            <div className="week-dots">{["L","M","M","J","V"].map((day, index) => <span className={index < 3 ? "done" : ""} key={`${day}-${index}`}>{index < 3 ? "✓" : day}</span>)}</div>
          </article>
          <article className="skill-proof">
            <div className="content-heading"><div><p className="eyebrow">PREUVES D'APPRENTISSAGE</p><h2>Vos quatre compétences</h2></div><span>{attempts.length} essai{attempts.length > 1 ? "s" : ""}</span></div>
            {[
              ["Intelligibilité",averageSpeechScore,"Mots compris par le coach"], ["Compréhension",listeningScore,"Épisodes compris sans aide"], ["Production",productionScore,"Phrases produites activement"], ["Régularité",60,"3 jours actifs sur 5"],
            ].map(([label,value,detail]) => <div className="skill-row" key={String(label)}><span><strong>{label}</strong><small>{detail}</small></span><div><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>)}
            {!attempts.length && <p className="empty-proof">Effectuez un essai dans Coach → Prononciation pour établir votre première mesure.</p>}
          </article>
          {attempts.length > 0 && <article className="attempt-history"><p className="eyebrow">DERNIERS ESSAIS</p><div>{attempts.slice(0, 5).map((attempt) => <span key={attempt.id} title={attempt.phrase}><i style={{ height: `${Math.max(18, attempt.score)}%` }} /><b>{attempt.score}</b></span>)}</div><small>Votre historique reste enregistré uniquement sur cet appareil.</small></article>}
          <article className={`certificate-card ${certificationScore >= 80 ? "ready" : ""}`}>
            <span className="certificate-mark">H</span>
            <div><p className="eyebrow">BILAN INTERNE {levelCode}</p><h2>{certificationScore >= 80 ? "Objectif de niveau atteint" : `${80 - certificationScore} points avant validation`}</h2><p>Indicateurs pédagogiques internes : compréhension, production, intelligibilité et régularité. Ce bilan n’est pas une certification officielle.</p></div>
            <strong>{certificationScore}%</strong>
          </article>
          <article className="account-sync">
            <span>{cloudStatus === "synced" ? "✓" : "↻"}</span><div><p className="eyebrow">COMPTE & DONNÉES</p><strong>{cloudStatus === "synced" ? "Progression synchronisée" : cloudStatus === "loading" ? "Connexion en cours…" : "Mode local sécurisé"}</strong><small>{cloudStatus === "synced" ? "Retrouvez votre parcours sur vos appareils connectés." : "L'export reste disponible à tout moment."}</small></div>
          </article>
          <button className="secondary export-progress" onClick={exportProgress}>Exporter ma progression</button>
          <button className="primary" onClick={() => openLesson()}>Continuer en {levelCode} <span>→</span></button>
        </section>
      )}

      {selectedModule && moduleDetail && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedModule(null)}>
          <section className="module-modal" role="dialog" aria-modal="true" aria-labelledby="module-title">
            <button className="modal-close" onClick={() => setSelectedModule(null)} aria-label="Fermer">×</button>
            <p className="eyebrow">{selectedModule.level} · PROGRAMME DÉTAILLÉ</p>
            <h2 id="module-title">{moduleDetail.title}</h2>
            <p className="module-goal">Objectif concret : {moduleDetail.goal.toLowerCase()} sans préparer vos phrases à l'avance.</p>
            <div className="session-syllabus">{Array.from({ length: moduleDetail.sessions }, (_, index) => {
              const [title, copy] = sessionFormats[index % sessionFormats.length];
              const cycle = Math.floor(index / sessionFormats.length) + 1;
              return <div key={`${title}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{title}{cycle > 1 ? ` · approfondissement ${cycle}` : ""}</strong><small>{copy} · thème : {moduleDetail.goal.toLowerCase()}</small></p><b>{index < 2 ? "Disponible" : "À suivre"}</b></div>;
            })}</div>
            <div className="module-outcome"><span>Preuve finale</span><strong>Dialogue de 90 secondes évalué sans sous-titres</strong></div>
            <button className="primary" onClick={() => { setLevelCode(selectedModule.level); setPhraseIndex(selectedModule.index % (levels.find((item) => item.code === selectedModule.level)?.phrases.length ?? 1)); setSelectedModule(null); setPracticeMode("listen"); setTranslation(true); setScreen("lesson"); }}>Commencer ce module <span>→</span></button>
          </section>
        </div>
      )}

      {commercialOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setCommercialOpen(false)}>
          <section className="commercial-modal" role="dialog" aria-modal="true" aria-labelledby="commercial-title">
            <button className="modal-close" onClick={() => setCommercialOpen(false)} aria-label="Fermer">×</button>
            <p className="eyebrow">BÊTA FONDATRICE</p>
            <h2 id="commercial-title">Aidez-nous à construire le meilleur coach pour francophones.</h2>
            <p className="commercial-lead">Réservez votre accès prioritaire. Vous découvrirez le prix et les conditions avant tout achat : aucun paiement n’est actif aujourd’hui.</p>
            <div className="price-grid">
              <article><p className="eyebrow">DÉCOUVERTE</p><h3>Gratuit</h3><strong>0 €</strong><ul><li>Diagnostic CECRL</li><li>1 mission quotidienne</li><li>Épisode 1 de la mini-série</li><li>Progression locale</li></ul><button className="secondary" onClick={() => { setSelectedPlan("free"); setCommercialOpen(false); }}>Continuer gratuitement</button></article>
              <article className="recommended"><span className="best-choice">ACCÈS PRIORITAIRE</span><p className="eyebrow">FONDATEUR</p><h3>Co-construire Hello!</h3><strong>0 €<small> aujourd’hui</small></strong><ul><li>24 expressions et 6 épisodes disponibles</li><li>Accents britannique et américain</li><li>Progression synchronisée</li><li>Nouveaux modules en avant-première</li><li>Tarif Fondateur annoncé avant achat</li></ul><button className="primary" onClick={requestPremium}>Rejoindre la bêta fondatrice</button></article>
            </div>
            {commercialMessage && <p className="commercial-message">✓ {commercialMessage}</p>}
            <div className="checkout-trust"><span>Aucun prélèvement</span><span>Information avant paiement</span><span>Données exportables</span></div>
            <details><summary>Que se passe-t-il après l’inscription ?</summary><p>Votre intérêt est enregistré. Vous serez informé de l’ouverture commerciale, du prix et des conditions avant de décider de souscrire.</p></details>
            <details><summary>Puis-je apprendre à mon rythme ?</summary><p>Oui. Le plan s'ajuste à 10, 15 ou 25 minutes par jour et reprogramme automatiquement les notions fragiles.</p></details>
            <footer><a href="/conditions">Conditions</a><a href="/confidentialite">Confidentialité</a><a href="/assistance">Assistance</a></footer>
          </section>
        </div>
      )}

      {diagnostic && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setDiagnostic(false)}>
          <section className="diagnostic-modal" role="dialog" aria-modal="true" aria-labelledby="diagnostic-title">
            <button className="modal-close" onClick={() => setDiagnostic(false)} aria-label="Fermer">×</button>
            {!diagnosticResult ? (
              <>
                <div className="diagnostic-meter"><span style={{ width: `${((diagnosticStep + 1) / diagnosticQuestions.length) * 100}%` }} /></div>
                <p className="eyebrow">BILAN CECRL · {diagnosticStep + 1}/{diagnosticQuestions.length} · {diagnosticQuestions[diagnosticStep].skill}</p>
                <h2 id="diagnostic-title">{diagnosticQuestions[diagnosticStep].prompt}</h2>
                <p>Répondez sans traducteur. Le niveau final dépend de la difficulté et de la régularité des réponses.</p>
                <div className="diagnostic-options">
                  {diagnosticQuestions[diagnosticStep].choices.map((choice, index) => <button key={choice} onClick={() => answerDiagnostic(index)}><b>{String.fromCharCode(65 + index)}</b><span>{choice}</span></button>)}
                </div>
              </>
            ) : (
              <div className="diagnostic-result">
                <span className="result-badge">{diagnosticResult}</span>
                <h2>Commencez ici.</h2>
                <p>Ce résultat analyse huit paliers de compréhension, grammaire, usage et nuance. La première semaine affinera automatiquement ce point de départ.</p>
                <button className="primary" onClick={applyDiagnostic}>Choisir le niveau {diagnosticResult}</button>
                <button className="text-button" onClick={resetDiagnostic}>Recommencer le bilan</button>
              </div>
            )}
          </section>
        </div>
      )}

      {screen !== "lesson" && (
        <nav className="bottom-nav" aria-label="Navigation principale">
          <button className={screen === "today" ? "selected" : ""} onClick={() => setScreen("today")}><span>⌂</span>Aujourd'hui</button>
          <button className={screen === "path" ? "selected" : ""} onClick={() => setScreen("path")}><span>◫</span>Parcours</button>
          <button className={screen === "series" ? "selected" : ""} onClick={() => setScreen("series")}><span>▶</span>Série</button>
          <button className={screen === "speak" ? "selected" : ""} onClick={() => setScreen("speak")}><span>◉</span>Coach</button>
          <button className={screen === "progress" ? "selected" : ""} onClick={() => setScreen("progress")}><span>◒</span>Progrès</button>
        </nav>
      )}
    </main>
  );
}
