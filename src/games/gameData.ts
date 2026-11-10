export type PromptCategory = 'drôle' | 'personnel' | 'amitié' | 'crush' | 'insolite';
export type PromptKind = 'vérité' | 'action';

export type GamePrompt = {
  id: string;
  category: PromptCategory;
  kind: PromptKind;
  text: string;
};

export const promptCategories: PromptCategory[] = ['drôle', 'personnel', 'amitié', 'crush', 'insolite'];
export const WOULD_YOU_RATHER_QUESTION_COUNT = 12;
export const PERSONALITY_QUESTION_COUNT = 20;

export const memoryPairs = [
  { symbol: '💖', label: 'Cœur', tint: '#FFB3C7' },
  { symbol: '⭐', label: 'Étoile', tint: '#FFE27A' },
  { symbol: '🌸', label: 'Fleur', tint: '#B6F0D3' },
  { symbol: '⚡', label: 'Éclair', tint: '#FFCBA6' },
  { symbol: '🧁', label: 'Gâteau', tint: '#DCCBFF' },
  { symbol: '🐱', label: 'Chat', tint: '#BFE3FF' },
  { symbol: '🍓', label: 'Fraise', tint: '#FFC0CB' },
  { symbol: '🌙', label: 'Lune', tint: '#C8D6FF' },
  { symbol: '🎈', label: 'Ballon', tint: '#FFD5A5' },
  { symbol: '☀️', label: 'Soleil', tint: '#FFE7A3' },
  { symbol: '🍀', label: 'Trèfle', tint: '#BFE6A8' },
  { symbol: '🐝', label: 'Abeille', tint: '#FFE08A' },
  { symbol: '🍉', label: 'Pastèque', tint: '#FFB7A8' },
  { symbol: '🧸', label: 'Ourson', tint: '#D9B99B' },
  { symbol: '🎵', label: 'Musique', tint: '#D7C6FF' },
  { symbol: '🦋', label: 'Papillon', tint: '#A9D8F5' },
] as const;

export type MemoryLevel = {
  id: string;
  title: string;
  cardCount: number;
  pairCount: number;
  columns: number;
};

export const memoryLevels = [
  { id: 'mini', title: 'Mini', cardCount: 6, pairCount: 3, columns: 3 },
  { id: 'classique', title: 'Classique', cardCount: 12, pairCount: 6, columns: 3 },
  { id: 'expert', title: 'Expert', cardCount: 32, pairCount: 16, columns: 4 },
] as const satisfies readonly MemoryLevel[];

export type TimedChallenge = {
  id: string;
  title: string;
  targetTaps: number;
  timeLimit: number;
};

export const timedChallenges = [
  { id: 'warm-up', title: 'Échauffement', targetTaps: 8, timeLimit: 8 },
  { id: 'classic', title: 'Classique', targetTaps: 10, timeLimit: 8 },
  { id: 'turbo', title: 'Turbo', targetTaps: 15, timeLimit: 8 },
] as const satisfies readonly TimedChallenge[];

export const gamePrompts: GamePrompt[] = [
  // --- drôle ---
  { id: 'fun-truth-1', category: 'drôle', kind: 'vérité', text: 'Quelle est la chose la plus drôle que tu aies faite sans t’en rendre compte ?' },
  { id: 'fun-truth-2', category: 'drôle', kind: 'vérité', text: 'Si tu devais parler comme un personnage de dessin animé toute la journée, lequel choisirais-tu ?' },
  { id: 'fun-truth-3', category: 'drôle', kind: 'vérité', text: 'Quel est le surnom le plus ridicule qu’on t’ait donné, et que tu assumes un peu ?' },
  { id: 'fun-truth-4', category: 'drôle', kind: 'vérité', text: 'Si ta vie était une sitcom, quel serait le titre de l’épisode d’aujourd’hui ?' },
  { id: 'fun-truth-5', category: 'drôle', kind: 'vérité', text: 'Quelle habitude un peu bizarre as-tu, que personne ne soupçonne ?' },
  { id: 'fun-action-1', category: 'drôle', kind: 'action', text: 'Fais ta meilleure imitation d’un chat qui réclame à manger.' },
  { id: 'fun-action-2', category: 'drôle', kind: 'action', text: 'Invente un nom de super-héros pour ton humeur du moment.' },
  { id: 'fun-action-3', category: 'drôle', kind: 'action', text: 'Raconte ce que tu as mangé aujourd’hui comme si tu commentais un match sportif.' },
  { id: 'fun-action-4', category: 'drôle', kind: 'action', text: 'Fais le bruit le plus ridicule que tu connaisses, sans rire. Bonne chance.' },
  { id: 'fun-action-5', category: 'drôle', kind: 'action', text: 'Invente un slogan publicitaire pour toi-même, en mode très premier degré.' },
  // --- personnel ---
  { id: 'personal-truth-1', category: 'personnel', kind: 'vérité', text: 'Quelle petite chose te remonte toujours le moral ?' },
  { id: 'personal-truth-2', category: 'personnel', kind: 'vérité', text: 'De quoi es-tu fière, même si tu en parles rarement ?' },
  { id: 'personal-truth-3', category: 'personnel', kind: 'vérité', text: 'Quel conseil donnerais-tu à la toi d’il y a un an ?' },
  { id: 'personal-truth-4', category: 'personnel', kind: 'vérité', text: 'Quelle chanson te représente le mieux en ce moment ?' },
  { id: 'personal-truth-5', category: 'personnel', kind: 'vérité', text: 'Quel est le compliment qui t’a le plus marquée, et qui te l’a fait ?' },
  { id: 'personal-action-1', category: 'personnel', kind: 'action', text: 'Choisis une chanson qui décrit ton humeur et fredonne quelques secondes.' },
  { id: 'personal-action-2', category: 'personnel', kind: 'action', text: 'Envoie-toi une note avec un compliment que tu mérites d’entendre.' },
  { id: 'personal-action-3', category: 'personnel', kind: 'action', text: 'Note trois choses pour lesquelles tu es reconnaissante aujourd’hui.' },
  { id: 'personal-action-4', category: 'personnel', kind: 'action', text: 'Décris ta journée idéale en cinq mots, pas un de plus.' },
  { id: 'personal-action-5', category: 'personnel', kind: 'action', text: 'Note deux petites victoires de cette semaine, même minuscules.' },
  // --- amitié ---
  { id: 'friendship-truth-1', category: 'amitié', kind: 'vérité', text: 'Quel souvenir d’amitié te donne encore le sourire ?' },
  { id: 'friendship-truth-2', category: 'amitié', kind: 'vérité', text: 'Quelle qualité apprécies-tu le plus chez une amie ?' },
  { id: 'friendship-truth-3', category: 'amitié', kind: 'vérité', text: 'Qui est la personne qui te fait le plus rire, et pourquoi ?' },
  { id: 'friendship-truth-4', category: 'amitié', kind: 'vérité', text: 'Quel est le meilleur conseil qu’une amie t’ait donné ?' },
  { id: 'friendship-truth-5', category: 'amitié', kind: 'vérité', text: 'Quelle tradition ou petit rituel partages-tu avec quelqu’un que tu aimes ?' },
  { id: 'friendship-action-1', category: 'amitié', kind: 'action', text: 'Pense à une personne qui compte pour toi et envoie-lui un petit coucou.' },
  { id: 'friendship-action-2', category: 'amitié', kind: 'action', text: 'Décris ton amie idéale en trois mots.' },
  { id: 'friendship-action-3', category: 'amitié', kind: 'action', text: 'Écris le début d’un message pour remercier quelqu’un qui t’a soutenue récemment.' },
  { id: 'friendship-action-4', category: 'amitié', kind: 'action', text: 'Choisis un emoji qui résume ta meilleure amie et explique pourquoi.' },
  { id: 'friendship-action-5', category: 'amitié', kind: 'action', text: 'Imagine une sortie parfaite entre amies et donne-lui un nom.' },
  // --- crush ---
  { id: 'crush-truth-1', category: 'crush', kind: 'vérité', text: 'Quel geste attentionné te fait fondre à coup sûr ?' },
  { id: 'crush-truth-2', category: 'crush', kind: 'vérité', text: 'Quelle serait ta sortie parfaite à deux ?' },
  { id: 'crush-truth-3', category: 'crush', kind: 'vérité', text: 'Quel petit détail chez quelqu’un te fait craquer en premier ?' },
  { id: 'crush-truth-4', category: 'crush', kind: 'vérité', text: 'Quelle est la chose la plus romantique que tu aies vue dans un film ?' },
  { id: 'crush-truth-5', category: 'crush', kind: 'vérité', text: 'Tu préfères les mots doux écrits ou dits à voix haute ?' },
  { id: 'crush-action-1', category: 'crush', kind: 'action', text: 'Imagine un rendez-vous surprise et donne-lui un nom de film.' },
  { id: 'crush-action-2', category: 'crush', kind: 'action', text: 'Fais une liste mentale de trois choses qui rendent quelqu’un attachant.' },
  { id: 'crush-action-3', category: 'crush', kind: 'action', text: 'Décris ton partenaire idéal avec une métaphore : un plat, une saison ou une couleur.' },
  { id: 'crush-action-4', category: 'crush', kind: 'action', text: 'Invente une phrase d’accroche volontairement beaucoup trop sérieuse.' },
  { id: 'crush-action-5', category: 'crush', kind: 'action', text: 'Choisis une chanson d’amour et explique en une phrase pourquoi elle te représente.' },
  // --- insolite ---
  { id: 'odd-truth-1', category: 'insolite', kind: 'vérité', text: 'Si les animaux pouvaient parler, lequel serait le plus impoli ?' },
  { id: 'odd-truth-2', category: 'insolite', kind: 'vérité', text: 'Quelle règle absurde aimerais-tu instaurer pour une journée ?' },
  { id: 'odd-truth-3', category: 'insolite', kind: 'vérité', text: 'Si tu devais vivre dans un dessin animé, lequel choisirais-tu et pourquoi ?' },
  { id: 'odd-truth-4', category: 'insolite', kind: 'vérité', text: 'Quel super-pouvoir totalement inutile aimerais-tu avoir ?' },
  { id: 'odd-truth-5', category: 'insolite', kind: 'vérité', text: 'Si tu étais un plat, lequel serais-tu et pourquoi ?' },
  { id: 'odd-action-1', category: 'insolite', kind: 'action', text: 'Invente une poignée de main secrète avec toi-même.' },
  { id: 'odd-action-2', category: 'insolite', kind: 'action', text: 'Donne un nom très sérieux à un objet près de toi.' },
  { id: 'odd-action-3', category: 'insolite', kind: 'action', text: 'Invente un mot qui n’existe pas et donne-lui une définition convaincante.' },
  { id: 'odd-action-4', category: 'insolite', kind: 'action', text: 'Raconte un souvenir d’enfance en changeant volontairement un détail, le plus sérieusement possible.' },
  { id: 'odd-action-5', category: 'insolite', kind: 'action', text: 'Décris la météo du jour comme un bulletin d’information très dramatique.' },
  { id: 'fun-truth-6', category: 'drôle', kind: 'vérité', text: 'Quel mot prononces-tu parfois de travers sans t’en rendre compte ?' },
  { id: 'fun-truth-7', category: 'drôle', kind: 'vérité', text: 'Quelle recherche internet récente serait la plus difficile à expliquer ?' },
  { id: 'fun-truth-8', category: 'drôle', kind: 'vérité', text: 'Quel est ton talent le plus inutile mais étonnamment fiable ?' },
  { id: 'fun-truth-9', category: 'drôle', kind: 'vérité', text: 'Quelle chanson connais-tu presque entièrement sans savoir pourquoi ?' },
  { id: 'fun-truth-10', category: 'drôle', kind: 'vérité', text: 'Quelle excuse bizarre as-tu déjà utilisée pour éviter une situation ?' },
  { id: 'fun-action-6', category: 'drôle', kind: 'action', text: 'Présente un objet près de toi comme s’il s’agissait d’une invention révolutionnaire.' },
  { id: 'fun-action-7', category: 'drôle', kind: 'action', text: 'Fais une phrase très sérieuse avec trois mots choisis au hasard.' },
  { id: 'fun-action-8', category: 'drôle', kind: 'action', text: 'Décris ton petit-déjeuner idéal avec la voix d’une présentatrice météo.' },
  { id: 'fun-action-9', category: 'drôle', kind: 'action', text: 'Invente une bande-annonce dramatique pour raconter ce que tu vas faire ensuite.' },
  { id: 'fun-action-10', category: 'drôle', kind: 'action', text: 'Fais un compliment original à la première chose que tu vois.' },
  { id: 'personal-truth-6', category: 'personnel', kind: 'vérité', text: 'Quelle limite personnelle as-tu appris à mieux respecter ?' },
  { id: 'personal-truth-7', category: 'personnel', kind: 'vérité', text: 'Quel moment récent t’a donné une vraie sensation de calme ?' },
  { id: 'personal-truth-8', category: 'personnel', kind: 'vérité', text: 'Quelle qualité aimerais-tu davantage reconnaître chez toi ?' },
  { id: 'personal-truth-9', category: 'personnel', kind: 'vérité', text: 'Quelle petite routine rend tes journées plus faciles ?' },
  { id: 'personal-truth-10', category: 'personnel', kind: 'vérité', text: 'Qu’aimerais-tu oser essayer cette année ?' },
  { id: 'personal-action-6', category: 'personnel', kind: 'action', text: 'Écris une phrase qui commence par : « Je peux être fière de moi parce que… »' },
  { id: 'personal-action-7', category: 'personnel', kind: 'action', text: 'Fais une pause de trente secondes et observe cinq détails autour de toi.' },
  { id: 'personal-action-8', category: 'personnel', kind: 'action', text: 'Choisis une petite tâche de moins de cinq minutes et fais-la maintenant.' },
  { id: 'personal-action-9', category: 'personnel', kind: 'action', text: 'Imagine ton futur toi dans un an et écris-lui un encouragement.' },
  { id: 'personal-action-10', category: 'personnel', kind: 'action', text: 'Donne un nom positif à la période que tu traverses en ce moment.' },
  { id: 'friendship-truth-6', category: 'amitié', kind: 'vérité', text: 'Quelle attention simple te fait te sentir vraiment considérée ?' },
  { id: 'friendship-truth-7', category: 'amitié', kind: 'vérité', text: 'Quel fou rire partagé aimerais-tu revivre ?' },
  { id: 'friendship-truth-8', category: 'amitié', kind: 'vérité', text: 'Quelle qualité apportes-tu naturellement dans un groupe ?' },
  { id: 'friendship-truth-9', category: 'amitié', kind: 'vérité', text: 'Quelle activité aimerais-tu découvrir avec une amie ?' },
  { id: 'friendship-truth-10', category: 'amitié', kind: 'vérité', text: 'Quel signe te montre qu’une amitié est vraiment sincère ?' },
  { id: 'friendship-action-6', category: 'amitié', kind: 'action', text: 'Écris un message de trois mots qui ferait sourire une amie.' },
  { id: 'friendship-action-7', category: 'amitié', kind: 'action', text: 'Imagine un nom de groupe d’amies et invente sa devise.' },
  { id: 'friendship-action-8', category: 'amitié', kind: 'action', text: 'Décris un souvenir heureux comme si tu écrivais une carte postale.' },
  { id: 'friendship-action-9', category: 'amitié', kind: 'action', text: 'Choisis une chanson qui ferait une bonne bande-son pour votre amitié.' },
  { id: 'friendship-action-10', category: 'amitié', kind: 'action', text: 'Imagine une journée surprise pour une amie et donne-lui trois étapes.' },
  { id: 'crush-truth-6', category: 'crush', kind: 'vérité', text: 'Quel détail te donne envie de mieux connaître quelqu’un ?' },
  { id: 'crush-truth-7', category: 'crush', kind: 'vérité', text: 'Quel compliment aimerais-tu recevoir plus souvent ?' },
  { id: 'crush-truth-8', category: 'crush', kind: 'vérité', text: 'Quel rendez-vous simple te semblerait parfait ?' },
  { id: 'crush-truth-9', category: 'crush', kind: 'vérité', text: 'Quelle qualité te fait rester quand la première impression est passée ?' },
  { id: 'crush-truth-10', category: 'crush', kind: 'vérité', text: 'Quel signe discret te ferait comprendre que tu plais à quelqu’un ?' },
  { id: 'crush-action-6', category: 'crush', kind: 'action', text: 'Écris une invitation à un rendez-vous en exactement sept mots.' },
  { id: 'crush-action-7', category: 'crush', kind: 'action', text: 'Décris une rencontre romantique en utilisant une saison et une boisson.' },
  { id: 'crush-action-8', category: 'crush', kind: 'action', text: 'Invente le titre d’une comédie romantique inspirée de ta vie.' },
  { id: 'crush-action-9', category: 'crush', kind: 'action', text: 'Donne trois sujets de conversation parfaits pour briser la glace.' },
  { id: 'crush-action-10', category: 'crush', kind: 'action', text: 'Fais une déclaration à une plante ou un objet, avec beaucoup de conviction.' },
  { id: 'odd-truth-6', category: 'insolite', kind: 'vérité', text: 'Quel objet du quotidien mériterait clairement un bouton secret ?' },
  { id: 'odd-truth-7', category: 'insolite', kind: 'vérité', text: 'Si tu pouvais changer la couleur d’un élément du monde, lequel choisirais-tu ?' },
  { id: 'odd-truth-8', category: 'insolite', kind: 'vérité', text: 'Quelle invention imaginaire résoudrait un petit problème de ta vie ?' },
  { id: 'odd-truth-9', category: 'insolite', kind: 'vérité', text: 'Si ton humeur était une créature, à quoi ressemblerait-elle ?' },
  { id: 'odd-truth-10', category: 'insolite', kind: 'vérité', text: 'Quel métier existerait dans un monde complètement loufoque ?' },
  { id: 'odd-action-6', category: 'insolite', kind: 'action', text: 'Invente une météo pour les émotions et annonce celle d’aujourd’hui.' },
  { id: 'odd-action-7', category: 'insolite', kind: 'action', text: 'Transforme une phrase banale en prophétie mystérieuse.' },
  { id: 'odd-action-8', category: 'insolite', kind: 'action', text: 'Imagine que tes chaussettes sont des personnages : présente-les.' },
  { id: 'odd-action-9', category: 'insolite', kind: 'action', text: 'Donne une mission secrète et parfaitement inoffensive à un objet proche.' },
  { id: 'odd-action-10', category: 'insolite', kind: 'action', text: 'Décris ton repas préféré comme une découverte archéologique.' },
  { id: 'fun-truth-11', category: 'drôle', kind: 'vérité', text: 'Quel petit malentendu t’a déjà fait rire après coup ?' },
  { id: 'fun-truth-12', category: 'drôle', kind: 'vérité', text: 'Si tu avais un générique à chaque entrée dans une pièce, quelle musique choisirais-tu ?' },
  { id: 'fun-truth-13', category: 'drôle', kind: 'vérité', text: 'Quelle expression utilises-tu beaucoup trop souvent ?' },
  { id: 'fun-truth-14', category: 'drôle', kind: 'vérité', text: 'Quel objet de ta maison serait le plus drôle comme colocataire ?' },
  { id: 'fun-truth-15', category: 'drôle', kind: 'vérité', text: 'Quelle drôle de chose te met instantanément de bonne humeur ?' },
  { id: 'fun-action-11', category: 'drôle', kind: 'action', text: 'Fais une publicité enthousiaste pour un objet tout à fait ordinaire.' },
  { id: 'fun-action-12', category: 'drôle', kind: 'action', text: 'Invente un nom de restaurant pour ton prochain repas.' },
  { id: 'fun-action-13', category: 'drôle', kind: 'action', text: 'Décris un animal comme si tu présentais une star de cinéma.' },
  { id: 'fun-action-14', category: 'drôle', kind: 'action', text: 'Fais une mini danse de victoire de trois secondes.' },
  { id: 'fun-action-15', category: 'drôle', kind: 'action', text: 'Imagine un nouveau parfum de glace et donne-lui un nom.' },
  { id: 'personal-truth-11', category: 'personnel', kind: 'vérité', text: 'Quelle réussite récente aimerais-tu prendre le temps de célébrer ?' },
  { id: 'personal-truth-12', category: 'personnel', kind: 'vérité', text: 'Quel endroit t’aide à te sentir tout de suite plus calme ?' },
  { id: 'personal-truth-13', category: 'personnel', kind: 'vérité', text: 'Quelle chose as-tu apprise récemment sur toi-même ?' },
  { id: 'personal-truth-14', category: 'personnel', kind: 'vérité', text: 'Quel petit plaisir aimerais-tu intégrer plus souvent à tes journées ?' },
  { id: 'personal-truth-15', category: 'personnel', kind: 'vérité', text: 'Quelle qualité t’aide quand tu traverses une journée difficile ?' },
  { id: 'personal-action-11', category: 'personnel', kind: 'action', text: 'Choisis une chanson qui te donne confiance et écoute-en un petit extrait.' },
  { id: 'personal-action-12', category: 'personnel', kind: 'action', text: 'Étire doucement tes épaules et prends trois respirations tranquilles.' },
  { id: 'personal-action-13', category: 'personnel', kind: 'action', text: 'Écris une chose que tu as faite aujourd’hui et dont tu peux être contente.' },
  { id: 'personal-action-14', category: 'personnel', kind: 'action', text: 'Trouve un mot gentil à te dire, comme tu le dirais à une amie.' },
  { id: 'personal-action-15', category: 'personnel', kind: 'action', text: 'Fais une mini pause et remarque une chose agréable autour de toi.' },
  { id: 'friendship-truth-11', category: 'amitié', kind: 'vérité', text: 'Quelle petite attention d’une amie t’a fait plaisir récemment ?' },
  { id: 'friendship-truth-12', category: 'amitié', kind: 'vérité', text: 'Quelle activité te fait perdre la notion du temps quand tu la partages ?' },
  { id: 'friendship-truth-13', category: 'amitié', kind: 'vérité', text: 'Quel souvenir te rappelle que tu peux compter sur tes proches ?' },
  { id: 'friendship-truth-14', category: 'amitié', kind: 'vérité', text: 'Quelle qualité aimerais-tu célébrer chez une amie ?' },
  { id: 'friendship-truth-15', category: 'amitié', kind: 'vérité', text: 'Quel genre de sortie simple te ferait plaisir avec quelqu’un que tu aimes ?' },
  { id: 'friendship-action-11', category: 'amitié', kind: 'action', text: 'Imagine une carte postale pour une amie et trouve-lui une phrase d’ouverture.' },
  { id: 'friendship-action-12', category: 'amitié', kind: 'action', text: 'Choisis un emoji qui représente une belle amitié et explique ton choix.' },
  { id: 'friendship-action-13', category: 'amitié', kind: 'action', text: 'Invente un petit rituel joyeux à faire lors de votre prochaine sortie.' },
  { id: 'friendship-action-14', category: 'amitié', kind: 'action', text: 'Trouve un titre de film pour raconter une journée passée avec tes amies.' },
  { id: 'friendship-action-15', category: 'amitié', kind: 'action', text: 'Pense à une personne qui t’a aidée et imagine comment la remercier.' },
  { id: 'crush-truth-11', category: 'crush', kind: 'vérité', text: 'Quelle façon de montrer son intérêt te paraît la plus sincère ?' },
  { id: 'crush-truth-12', category: 'crush', kind: 'vérité', text: 'Quelle conversation pourrait te faire oublier l’heure ?' },
  { id: 'crush-truth-13', category: 'crush', kind: 'vérité', text: 'Quel petit geste attentionné te ferait sourire après une longue journée ?' },
  { id: 'crush-truth-14', category: 'crush', kind: 'vérité', text: 'Quelle valeur aimerais-tu partager avec une personne proche ?' },
  { id: 'crush-truth-15', category: 'crush', kind: 'vérité', text: 'Quel compliment te semblerait vraiment personnel et sincère ?' },
  { id: 'crush-action-11', category: 'crush', kind: 'action', text: 'Imagine une invitation à prendre un chocolat chaud, simple et sans pression.' },
  { id: 'crush-action-12', category: 'crush', kind: 'action', text: 'Invente le nom d’une playlist pour une promenade à deux.' },
  { id: 'crush-action-13', category: 'crush', kind: 'action', text: 'Décris un rendez-vous idéal en trois détails tout simples.' },
  { id: 'crush-action-14', category: 'crush', kind: 'action', text: 'Trouve une question amusante pour apprendre à connaître quelqu’un.' },
  { id: 'crush-action-15', category: 'crush', kind: 'action', text: 'Imagine un compliment qui parle d’une qualité plutôt que de l’apparence.' },
  { id: 'odd-truth-11', category: 'insolite', kind: 'vérité', text: 'Si les nuages avaient des noms, comment s’appellerait celui d’aujourd’hui ?' },
  { id: 'odd-truth-12', category: 'insolite', kind: 'vérité', text: 'Quel objet banal deviendrait magique avec un tout petit pouvoir ?' },
  { id: 'odd-truth-13', category: 'insolite', kind: 'vérité', text: 'Si tu pouvais inventer une nouvelle saison, à quoi ressemblerait-elle ?' },
  { id: 'odd-truth-14', category: 'insolite', kind: 'vérité', text: 'Quel animal ferait le meilleur bibliothécaire ?' },
  { id: 'odd-truth-15', category: 'insolite', kind: 'vérité', text: 'Quel bruit du quotidien devrait avoir son propre instrument de musique ?' },
  { id: 'odd-action-11', category: 'insolite', kind: 'action', text: 'Donne un nom de scène à un objet près de toi et présente-le.' },
  { id: 'odd-action-12', category: 'insolite', kind: 'action', text: 'Invente une fête qui durerait une heure et explique ce qu’on y ferait.' },
  { id: 'odd-action-13', category: 'insolite', kind: 'action', text: 'Imagine un nouveau panneau de signalisation pour un problème très quotidien.' },
  { id: 'odd-action-14', category: 'insolite', kind: 'action', text: 'Raconte la météo comme si tu étais un explorateur sur une planète inconnue.' },
  { id: 'odd-action-15', category: 'insolite', kind: 'action', text: 'Crée un slogan pour une boutique qui vendrait des rêves en bouteille.' },
];

export type ChoiceQuestion = {
  id: string;
  prompt: string;
  choices: [string, string];
  reactions: [string, string];
};

export const wouldYouRatherQuestions: ChoiceQuestion[] = [
  { id: 'choice-1', prompt: 'Tu préfères…', choices: ['Parler aux animaux', 'Comprendre toutes les langues'], reactions: ['Les animaux auraient sûrement plein de potins !', 'Plus aucune chanson sans paroles mystérieuses.'] },
  { id: 'choice-2', prompt: 'Tu préfères…', choices: ['Vivre près de la mer', 'Vivre près d’une forêt'], reactions: ['Le bruit des vagues pour se réveiller.', 'Une petite promenade sous les arbres.'] },
  { id: 'choice-3', prompt: 'Tu préfères…', choices: ['Un pique-nique improvisé', 'Une soirée film cocooning'], reactions: ['La couverture à carreaux t’attend !', 'Pop-corn et chaussettes douillettes.'] },
  { id: 'choice-4', prompt: 'Tu préfères…', choices: ['Savoir dessiner parfaitement', 'Savoir chanter parfaitement'], reactions: ['Le monde devient ton carnet.', 'Concert privé dans la salle de bain !'] },
  { id: 'choice-5', prompt: 'Tu préfères…', choices: ['Un voyage surprise', 'Une journée entière sans programme'], reactions: ['Valise prête, destination mystère.', 'Le luxe de suivre son envie du moment.'] },
  { id: 'choice-6', prompt: 'Tu préfères…', choices: ['Des pancakes tous les matins', 'Une pizza chaque vendredi'], reactions: ['Le petit-déjeuner devient une fête.', 'Vendredi vient de gagner des points.'] },
  { id: 'choice-7', prompt: 'Tu préfères…', choices: ['Te réveiller sans réveil, toujours à l’heure', 'Ne jamais être fatiguée, même après une courte nuit'], reactions: ['Le matin devient tout de suite plus doux.', 'Ton énergie ne connaît plus de pause.'] },
  { id: 'choice-8', prompt: 'Et si tu devais choisir :', choices: ['Relire ton livre préféré pour toujours', 'Découvrir un livre génial chaque semaine'], reactions: ['Une vieille habitude qui rassure.', 'Ta pile à lire n’a aucune chance de refroidir.'] },
  { id: 'choice-9', prompt: 'Tu préfères…', choices: ['Un câlin qui dure une minute entière', 'Dix petits compliments sincères dans la journée'], reactions: ['Soixante secondes qui changent tout.', 'Dix petites phrases, une grande journée.'] },
  { id: 'choice-10', prompt: 'Dans l’idéal, tu choisis…', choices: ['Mettre le temps en pause dix minutes par jour', 'Revivre ta journée préférée une fois par mois'], reactions: ['Dix minutes rien que pour souffler.', 'Le meilleur jour de ta vie, en rediffusion.'] },
  { id: 'choice-11', prompt: 'Tu préfères…', choices: ['Une maison toujours bien rangée sans effort', 'Un frigo toujours plein de bonnes surprises'], reactions: ['Zéro rangement, que du confort.', 'Chaque ouverture de frigo devient une surprise.'] },
  { id: 'choice-12', prompt: 'Si tu devais trancher :', choices: ['Savoir toujours ce qu’il faut dire', 'Savoir toujours ce qu’il faut faire'], reactions: ['Les mots justes, toujours au bon moment.', 'Les actes parlent plus fort que les discours.'] },
  { id: 'choice-13', prompt: 'Tu préfères…', choices: ['Voyager dans le passé pour un jour', 'Voir cinq minutes de ton futur'], reactions: ['Un petit détour dans tes souvenirs.', 'Un aperçu qui donne le sourire d’avance.'] },
  { id: 'choice-14', prompt: 'Et si tu devais choisir :', choices: ['Un fou rire qui dure toute la soirée', 'Un silence confortable avec quelqu’un'], reactions: ['Les fous rires, ça recharge les batteries.', 'Le silence qui dit tout sans un mot.'] },
  { id: 'choice-15', prompt: 'Tu préfères…', choices: ['Recevoir une lettre manuscrite', 'Recevoir un message vocal surprise'], reactions: ['L’écriture a ce petit quelque chose en plus.', 'Une voix qui surprend toujours agréablement.'] },
  { id: 'choice-16', prompt: 'Dans l’idéal, tu choisis…', choices: ['Une playlist faite pour toi', 'Une liste de films faite pour toi'], reactions: ['Chaque chanson pensée pour ton humeur.', 'Un petit cinéma rien que pour toi.'] },
  { id: 'choice-17', prompt: 'Tu préfères…', choices: ['Avoir un bouton pause pour les journées chargées', 'Avoir un bouton avance rapide pour les tâches pénibles'], reactions: ['Une respiration quand tu en as besoin.', 'Les corvées terminées en un éclair.'] },
  { id: 'choice-18', prompt: 'Tu préfères…', choices: ['Vivre dans une cabane cosy', 'Vivre dans un appartement avec vue sur la ville'], reactions: ['Bois, plaids et calme absolu.', 'Les lumières de la ville à perte de vue.'] },
  { id: 'choice-19', prompt: 'Et si tu devais choisir :', choices: ['Toujours trouver une place de parking', 'Ne jamais faire la queue'], reactions: ['Le stationnement devient un jeu d’enfant.', 'Chaque attente disparaît comme par magie.'] },
  { id: 'choice-20', prompt: 'Tu préfères…', choices: ['Recevoir un cadeau parfait mais inattendu', 'Choisir toi-même un cadeau très attentionné'], reactions: ['La surprise qui tombe juste.', 'Le plaisir de viser exactement ce qui fait sourire.'] },
  { id: 'choice-21', prompt: 'Dans l’idéal, tu choisis…', choices: ['Un dimanche entièrement consacré au repos', 'Un dimanche rempli de petites aventures'], reactions: ['Pyjama, douceur et aucune obligation.', 'Une collection de souvenirs en une journée.'] },
  { id: 'choice-22', prompt: 'Tu préfères…', choices: ['Pouvoir parler toutes les langues', 'Pouvoir jouer de tous les instruments'], reactions: ['Le monde entier devient une conversation.', 'Chaque pièce peut devenir une scène.'] },
  { id: 'choice-23', prompt: 'Si tu devais trancher :', choices: ['Toujours avoir la température parfaite', 'Toujours avoir la lumière parfaite pour les photos'], reactions: ['Jamais trop chaud, jamais trop froid.', 'Chaque souvenir mérite son meilleur éclairage.'] },
  { id: 'choice-24', prompt: 'Tu préfères…', choices: ['Un dîner préparé par quelqu’un que tu aimes', 'Un dessert imaginé spécialement pour toi'], reactions: ['Le goût tendre des petites attentions.', 'Une dernière bouchée absolument inoubliable.'] },
  { id: 'choice-25', prompt: 'Et si tu devais choisir :', choices: ['Pouvoir retrouver n’importe quel objet perdu', 'Pouvoir réparer n’importe quel vêtement'], reactions: ['Les clés ne disparaissent plus jamais.', 'Une seconde vie pour toutes tes pièces préférées.'] },
  { id: 'choice-26', prompt: 'Tu préfères…', choices: ['Avoir toujours une bonne idée au bon moment', 'Avoir toujours le courage de la réaliser'], reactions: ['Ton imagination ne te laisse jamais tomber.', 'Tes idées deviennent enfin des projets.'] },
  { id: 'choice-27', prompt: 'Dans l’idéal, tu choisis…', choices: ['Un réveil avec ta chanson préférée', 'Un coucher avec une histoire racontée'], reactions: ['Commencer la journée en musique.', 'Finir la journée dans un joli monde.'] },
  { id: 'choice-28', prompt: 'Tu préfères…', choices: ['Connaître la date de chaque fête surprise', 'Ne jamais savoir ce qui t’attend'], reactions: ['L’anticipation devient déjà une fête.', 'Chaque jour garde sa petite magie.'] },
  { id: 'choice-29', prompt: 'Tu préfères…', choices: ['Être excellente en cuisine', 'Être excellente en décoration'], reactions: ['Chaque repas devient une occasion.', 'Chaque pièce raconte une histoire.'] },
  { id: 'choice-30', prompt: 'Si tu devais choisir :', choices: ['Un album photo qui se complète tout seul', 'Une boîte qui conserve tous tes souvenirs heureux'], reactions: ['Les moments importants se rangent joliment.', 'Un trésor à ouvrir les jours gris.'] },
  { id: 'choice-31', prompt: 'Tu préfères…', choices: ['Recevoir un compliment par jour', 'Faire rire quelqu’un chaque jour'], reactions: ['Une petite dose de confiance quotidienne.', 'Le rire devient ton super-pouvoir.'] },
  { id: 'choice-32', prompt: 'Et si tu devais choisir :', choices: ['Explorer une ville inconnue avec une carte', 'Explorer une ville inconnue sans aucun plan'], reactions: ['Chaque rue devient une découverte choisie.', 'Les meilleures histoires commencent parfois au hasard.'] },
  { id: 'choice-33', prompt: 'Tu préfères…', choices: ['Avoir une plante qui te donne des conseils', 'Avoir un animal qui comprend toutes tes blagues'], reactions: ['Une sagesse verte près de toi.', 'Enfin un public qui rit à tous les coups.'] },
  { id: 'choice-34', prompt: 'Dans l’idéal, tu choisis…', choices: ['Un carnet qui transforme tes idées en dessins', 'Un carnet qui transforme tes rêves en histoires'], reactions: ['Tes pensées prennent toutes les couleurs.', 'Chaque nuit devient le début d’un récit.'] },
  { id: 'choice-35', prompt: 'Tu préfères…', choices: ['Pouvoir revivre un seul fou rire', 'Pouvoir revivre un seul coucher de soleil'], reactions: ['Le même rire, toujours aussi contagieux.', 'Un ciel magnifique rien que pour toi.'] },
  { id: 'choice-36', prompt: 'Tu préfères…', choices: ['Une maison avec une pièce secrète', 'Une maison avec un jardin magique'], reactions: ['Un refuge caché pour tes idées.', 'Des fleurs qui rendent les journées plus douces.'] },
  { id: 'choice-37', prompt: 'Si tu devais trancher :', choices: ['Toujours recevoir des nouvelles au bon moment', 'Toujours savoir quand quelqu’un pense à toi'], reactions: ['Les messages arrivent quand ils comptent.', 'Une présence invisible mais réconfortante.'] },
  { id: 'choice-38', prompt: 'Tu préfères…', choices: ['Un voyage vers une île calme', 'Un voyage vers une capitale pleine de vie'], reactions: ['Mer, soleil et rythme tranquille.', 'Des rues animées et mille choses à voir.'] },
  { id: 'choice-39', prompt: 'Tu préfères…', choices: ['Être la personne la plus organisée du groupe', 'Être la personne qui trouve toujours le plan parfait'], reactions: ['Tout est prévu avec sérénité.', 'Les meilleures idées apparaissent au bon moment.'] },
  { id: 'choice-40', prompt: 'Et si tu devais choisir :', choices: ['Une journée où tout le monde te comprend', 'Une journée où tu comprends parfaitement tout le monde'], reactions: ['Plus besoin d’expliquer ce que tu ressens.', 'Une écoute totale et pleine de douceur.'] },
  { id: 'choice-41', prompt: 'Tu préfères…', choices: ['Un jardin rempli de fleurs sauvages', 'Un balcon rempli d’herbes aromatiques'], reactions: ['Un coin coloré qui change avec les saisons.', 'Quelques feuilles fraîches à cueillir en cuisinant.'] },
  { id: 'choice-42', prompt: 'Et si tu devais choisir :', choices: ['Apprendre une nouvelle recette chaque semaine', 'Découvrir un nouvel endroit chaque semaine'], reactions: ['De bonnes choses à partager autour de la table.', 'Une collection de petits souvenirs à explorer.'] },
  { id: 'choice-43', prompt: 'Tu préfères…', choices: ['Un réveil avec le chant des oiseaux', 'Un réveil avec ta chanson préférée'], reactions: ['Une matinée qui commence au calme.', 'Un concert privé dès le premier instant.'] },
  { id: 'choice-44', prompt: 'Dans l’idéal, tu choisis…', choices: ['Une bibliothèque secrète chez toi', 'Un atelier créatif toujours prêt'], reactions: ['Des histoires à portée de main.', 'Une idée peut devenir quelque chose de concret.'] },
  { id: 'choice-45', prompt: 'Tu préfères…', choices: ['Pouvoir revoir un beau souvenir en rêve', 'Pouvoir choisir le thème de tes rêves'], reactions: ['Une visite toute douce du passé.', 'Chaque nuit devient une nouvelle aventure.'] },
  { id: 'choice-46', prompt: 'Et si tu devais choisir :', choices: ['Une journée sans notifications', 'Une journée sans aucune obligation'], reactions: ['Un peu de silence pour profiter du moment.', 'Du temps libre pour suivre tes envies.'] },
  { id: 'choice-47', prompt: 'Tu préfères…', choices: ['Avoir toujours la bonne lumière pour une photo', 'Avoir toujours la bonne chanson pour un moment'], reactions: ['Chaque souvenir est joliment éclairé.', 'La bande-son parfaite t’accompagne partout.'] },
  { id: 'choice-48', prompt: 'Dans l’idéal, tu choisis…', choices: ['Un petit-déjeuner servi au lit', 'Un dîner préparé rien que pour toi'], reactions: ['Le matin commence en douceur.', 'Une belle attention pour finir la journée.'] },
  { id: 'choice-49', prompt: 'Tu préfères…', choices: ['Une promenade au bord d’un lac', 'Une promenade dans une vieille ville'], reactions: ['L’eau calme et l’air frais pour se ressourcer.', 'Des ruelles pleines de détails à découvrir.'] },
  { id: 'choice-50', prompt: 'Et si tu devais choisir :', choices: ['Recevoir une bonne nouvelle par surprise', 'Pouvoir annoncer une bonne nouvelle à quelqu’un'], reactions: ['Le sourire inattendu qui illumine la journée.', 'Le plaisir de partager un moment heureux.'] },
  { id: 'choice-51', prompt: 'Tu préfères…', choices: ['Savoir faire des bouquets magnifiques', 'Savoir emballer les cadeaux parfaitement'], reactions: ['Des fleurs qui rendent chaque pièce plus joyeuse.', 'Chaque paquet devient une petite œuvre.'] },
  { id: 'choice-52', prompt: 'Dans l’idéal, tu choisis…', choices: ['Un hamac à l’ombre pour lire', 'Un fauteuil près d’une fenêtre ensoleillée'], reactions: ['Une sieste ou un chapitre, selon l’envie.', 'La lumière parfaite pour un moment tranquille.'] },
  { id: 'choice-53', prompt: 'Tu préfères…', choices: ['Retrouver facilement tous tes objets', 'Toujours te souvenir des anniversaires'], reactions: ['Fini les clés cachées dans des endroits improbables.', 'Une petite attention au bon moment pour chacun.'] },
  { id: 'choice-54', prompt: 'Et si tu devais choisir :', choices: ['Une soirée jeux pleine de fous rires', 'Une soirée histoires et souvenirs'], reactions: ['Les règles sont simples : on s’amuse.', 'Chaque anecdote rapproche un peu plus.'] },
  { id: 'choice-55', prompt: 'Tu préfères…', choices: ['Un manteau toujours à la bonne température', 'Des chaussures toujours confortables'], reactions: ['Le temps ne décide plus de ta tenue.', 'Chaque promenade devient plus agréable.'] },
  { id: 'choice-56', prompt: 'Dans l’idéal, tu choisis…', choices: ['Une journée entière à créer quelque chose', 'Une journée entière à apprendre quelque chose'], reactions: ['Tu repars avec une création faite par toi.', 'Ta curiosité a de quoi se régaler.'] },
  { id: 'choice-57', prompt: 'Tu préfères…', choices: ['Un message gentil chaque matin', 'Un appel surprise d’une personne chère chaque semaine'], reactions: ['Un petit mot pour commencer la journée.', 'Une voix familière pour prendre des nouvelles.'] },
  { id: 'choice-58', prompt: 'Et si tu devais choisir :', choices: ['Pouvoir faire pousser des fleurs en une nuit', 'Pouvoir faire mûrir les fruits en une heure'], reactions: ['Un jardin fleuri au réveil, quel rêve.', 'Des fruits frais presque à la demande.'] },
  { id: 'choice-59', prompt: 'Tu préfères…', choices: ['Un pique-nique au lever du soleil', 'Un goûter au coucher du soleil'], reactions: ['La journée commence avec une belle lumière.', 'Une pause gourmande pour finir en douceur.'] },
  { id: 'choice-60', prompt: 'Dans l’idéal, tu choisis…', choices: ['Un album photo de tes meilleurs moments', 'Une boîte de petits mots écrits par tes proches'], reactions: ['Des souvenirs à feuilleter quand tu veux.', 'Des mots doux à découvrir encore et encore.'] },
];

export const personalityQuestions = [
  {
    id: 'personality-1',
    prompt: 'Ton après-midi idéal ressemble plutôt à…',
    choices: [
      { text: 'Une promenade au soleil', type: 'rayon' },
      { text: 'Un livre et un coin tranquille', type: 'reveuse' },
      { text: 'Un plan improvisé entre amies', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-2',
    prompt: 'Quand une amie a besoin de toi, tu…',
    choices: [
      { text: 'Trouves les mots qui réconfortent', type: 'coeur' },
      { text: 'Lui proposes une petite aventure', type: 'etincelle' },
      { text: 'L’écoutes avec toute ton attention', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-3',
    prompt: 'La surprise qui te ferait plaisir ?',
    choices: [
      { text: 'Un mot doux inattendu', type: 'coeur' },
      { text: 'Une sortie spontanée', type: 'rayon' },
      { text: 'Un petit cadeau original', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-4',
    prompt: 'Choisis ta météo intérieure :',
    choices: [
      { text: 'Un soleil tranquille', type: 'rayon' },
      { text: 'Un ciel étoilé', type: 'reveuse' },
      { text: 'Une pluie de confettis', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-5',
    prompt: 'Ce qui te ressemble le plus, c’est…',
    choices: [
      { text: 'Ta gentillesse', type: 'coeur' },
      { text: 'Ton imagination', type: 'reveuse' },
      { text: 'Ton énergie contagieuse', type: 'rayon' },
    ],
  },
  {
    id: 'personality-6',
    prompt: 'Ta façon de profiter d’une journée libre ?',
    choices: [
      { text: 'Un plan plein de soleil dehors', type: 'rayon' },
      { text: 'Un moment cocooning avec tes pensées', type: 'reveuse' },
      { text: 'Une activité décidée sur un coup de tête', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-7',
    prompt: 'Dans un groupe, on compte souvent sur toi pour…',
    choices: [
      { text: 'Apaiser les tensions', type: 'coeur' },
      { text: 'Lancer une idée originale', type: 'etincelle' },
      { text: 'Garder le cap et l’énergie', type: 'rayon' },
    ],
  },
  {
    id: 'personality-8',
    prompt: 'Ton rituel du soir préféré ?',
    choices: [
      { text: 'Écrire ou penser à ceux que tu aimes', type: 'coeur' },
      { text: 'Improviser une dernière petite aventure', type: 'etincelle' },
      { text: 'Laisser vagabonder ton imagination', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-9',
    prompt: 'Ce qui te touche le plus chez quelqu’un ?',
    choices: [
      { text: 'Sa gentillesse sincère', type: 'coeur' },
      { text: 'Son énergie positive', type: 'rayon' },
      { text: 'Sa sensibilité discrète', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-10',
    prompt: 'Ta manière de marquer un moment important ?',
    choices: [
      { text: 'Le partager avec les gens que tu aimes', type: 'coeur' },
      { text: 'L’improviser en grande fête', type: 'etincelle' },
      { text: 'Le garder précieusement dans tes pensées', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-11',
    prompt: 'Quand tu arrives dans un nouvel endroit, tu remarques d’abord…',
    choices: [
      { text: 'La lumière et l’ambiance', type: 'rayon' },
      { text: 'Les petits détails de décoration', type: 'reveuse' },
      { text: 'Les personnes avec qui discuter', type: 'coeur' },
    ],
  },
  {
    id: 'personality-12',
    prompt: 'Pour te motiver, tu préfères…',
    choices: [
      { text: 'Une musique qui donne de l’énergie', type: 'etincelle' },
      { text: 'Un objectif écrit clairement', type: 'rayon' },
      { text: 'Quelqu’un qui croit en toi', type: 'coeur' },
    ],
  },
  {
    id: 'personality-13',
    prompt: 'Ton dimanche parfait commence par…',
    choices: [
      { text: 'Un petit-déjeuner coloré', type: 'rayon' },
      { text: 'Une matinée sans réveil', type: 'reveuse' },
      { text: 'Un message à une personne chère', type: 'coeur' },
    ],
  },
  {
    id: 'personality-14',
    prompt: 'Face à un imprévu, tu…',
    choices: [
      { text: 'Transformes le problème en aventure', type: 'etincelle' },
      { text: 'Cherches immédiatement une solution', type: 'rayon' },
      { text: 'Prends le temps de comprendre ce que tu ressens', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-15',
    prompt: 'Le cadeau qui te touche le plus est…',
    choices: [
      { text: 'Une expérience à partager', type: 'etincelle' },
      { text: 'Un objet choisi avec soin', type: 'coeur' },
      { text: 'Un carnet rempli de mots doux', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-16',
    prompt: 'Dans une équipe, tu es plutôt celle qui…',
    choices: [
      { text: 'Encourage tout le monde', type: 'rayon' },
      { text: 'Imagine une approche différente', type: 'etincelle' },
      { text: 'Veille à ce que personne ne soit oublié', type: 'coeur' },
    ],
  },
  {
    id: 'personality-17',
    prompt: 'Quelle image décrit le mieux ton énergie ?',
    choices: [
      { text: 'Un feu d’artifice', type: 'etincelle' },
      { text: 'Une fenêtre ouverte au printemps', type: 'rayon' },
      { text: 'Une lampe allumée dans la nuit', type: 'coeur' },
    ],
  },
  {
    id: 'personality-18',
    prompt: 'Quand tu as une heure pour toi, tu…',
    choices: [
      { text: 'Inventes ou fabriques quelque chose', type: 'etincelle' },
      { text: 'Sors prendre l’air', type: 'rayon' },
      { text: 'Écoutes de la musique et laisses tes pensées voyager', type: 'reveuse' },
    ],
  },
  {
    id: 'personality-19',
    prompt: 'Ce qui rend une conversation inoubliable, c’est…',
    choices: [
      { text: 'Un échange sincère', type: 'coeur' },
      { text: 'Une idée qui ouvre l’imagination', type: 'reveuse' },
      { text: 'Un fou rire imprévisible', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-20',
    prompt: 'La phrase qui te ressemble le plus serait…',
    choices: [
      { text: '« On va trouver une solution. »', type: 'rayon' },
      { text: '« Et si on essayait quelque chose de nouveau ? »', type: 'etincelle' },
      { text: '« Je suis là, raconte-moi. »', type: 'coeur' },
    ],
  },
  {
    id: 'personality-21',
    prompt: 'Quand tu découvres une nouvelle idée, tu…',
    choices: [
      { text: 'Imagines tout ce qu’elle pourrait devenir', type: 'reveuse' },
      { text: 'As envie de la tester tout de suite', type: 'etincelle' },
      { text: 'Cherches avec qui la partager', type: 'coeur' },
    ],
  },
  {
    id: 'personality-22',
    prompt: 'Un moment parfait pour recharger tes batteries ?',
    choices: [
      { text: 'Dehors, à profiter de la lumière', type: 'rayon' },
      { text: 'Au calme avec une activité créative', type: 'reveuse' },
      { text: 'À rire avec les personnes que tu aimes', type: 'coeur' },
    ],
  },
  {
    id: 'personality-23',
    prompt: 'On te confie une petite fête à organiser. Tu…',
    choices: [
      { text: 'Prépares une ambiance chaleureuse pour tout le monde', type: 'coeur' },
      { text: 'Trouves un thème original et inattendu', type: 'etincelle' },
      { text: 'Penses aux détails qui rendront la journée lumineuse', type: 'rayon' },
    ],
  },
  {
    id: 'personality-24',
    prompt: 'Quelle pause te ferait le plus de bien ?',
    choices: [
      { text: 'Regarder le ciel et laisser venir les idées', type: 'reveuse' },
      { text: 'Bouger un peu et changer d’air', type: 'etincelle' },
      { text: 'Partager un goûter avec une personne chère', type: 'coeur' },
    ],
  },
  {
    id: 'personality-25',
    prompt: 'Face à une page blanche, tu préfères…',
    choices: [
      { text: 'Écrire ce qui te passe par la tête', type: 'reveuse' },
      { text: 'Dessiner un plan et avancer étape par étape', type: 'rayon' },
      { text: 'Demander une idée à quelqu’un de confiance', type: 'coeur' },
    ],
  },
  {
    id: 'personality-26',
    prompt: 'Le compliment qui te ressemble le plus ?',
    choices: [
      { text: '« Tu rends les choses plus positives. »', type: 'rayon' },
      { text: '« Tu as toujours une idée surprenante. »', type: 'etincelle' },
      { text: '« On se sent écoutée avec toi. »', type: 'coeur' },
    ],
  },
  {
    id: 'personality-27',
    prompt: 'Tu gardes un souvenir précieux surtout pour…',
    choices: [
      { text: 'L’émotion qu’il te fait encore ressentir', type: 'coeur' },
      { text: 'Les images et les détails qui te reviennent', type: 'reveuse' },
      { text: 'L’énergie joyeuse de ce moment', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-28',
    prompt: 'Pour commencer un nouveau projet, tu…',
    choices: [
      { text: 'Choisis une première étape concrète', type: 'rayon' },
      { text: 'Rassembles des idées et des inspirations', type: 'reveuse' },
      { text: 'Te lances avec enthousiasme', type: 'etincelle' },
    ],
  },
  {
    id: 'personality-29',
    prompt: 'Dans une journée pluvieuse, tu préfères…',
    choices: [
      { text: 'Inventer une activité amusante à faire dedans', type: 'etincelle' },
      { text: 'Te blottir avec un livre ou de la musique', type: 'reveuse' },
      { text: 'Préparer quelque chose de bon à partager', type: 'coeur' },
    ],
  },
  {
    id: 'personality-30',
    prompt: 'Quand tu termines une journée bien remplie, tu…',
    choices: [
      { text: 'Repenses aux petites choses réussies', type: 'rayon' },
      { text: 'Racontes ton meilleur moment à quelqu’un', type: 'coeur' },
      { text: 'Penses déjà à une nouvelle aventure', type: 'etincelle' },
    ],
  },
] as const;

export const personalityProfiles = {
  rayon: { title: 'Petit rayon de soleil', description: 'Tu apportes de l’élan et de la lumière autour de toi. Ta bonne humeur sait faire de la place aux autres.' },
  reveuse: { title: 'Grande rêveuse', description: 'Tu remarques les détails et tu as un monde intérieur plein de belles idées.' },
  etincelle: { title: 'Étincelle spontanée', description: 'Tu sais transformer un moment ordinaire en aventure inattendue.' },
  coeur: { title: 'Cœur tout doux', description: 'Ton écoute et tes petites attentions rendent les gens précieux autour de toi.' },
} as const;

export type PersonalityType = keyof typeof personalityProfiles;

export type WordRiddle = {
  answer: string;
  hints: [string, string, string];
};

export const wordRiddles: WordRiddle[] = [
  { answer: 'arc-en-ciel', hints: ['Je viens souvent après la pluie.', 'Je dessine plusieurs couleurs dans le ciel.', 'Mon nom commence par arc.'] },
  { answer: 'papillon', hints: ['Je commence ma vie autrement.', 'J’aime les fleurs et le soleil.', 'Je vole avec de grandes ailes colorées.'] },
  { answer: 'chocolat', hints: ['On me partage volontiers au goûter.', 'Je peux être noir, blanc ou au lait.', 'Je fond doucement dans la bouche.'] },
  { answer: 'parapluie', hints: ['Je sors quand le ciel fait des siennes.', 'Je me plie pour se ranger.', 'Je protège de la pluie.'] },
  { answer: 'coccinelle', hints: ['Je porte une jolie couleur vive.', 'J’ai de petites ailes.', 'Je suis rouge avec des points noirs.'] },
  { answer: 'licorne', hints: ['Je n’existe que dans les histoires.', 'On me dessine souvent en couleurs pastel.', 'J’ai une longue corne sur le front.'] },
  { answer: 'bibliotheque', hints: ['Je suis un endroit calme rempli d’histoires.', 'On y vient pour emprunter un livre.', 'Mon nom commence par biblio.'] },
  { answer: 'tournesol', hints: ['Je suis une fleur qui aime regarder le ciel.', 'Mon nom parle du soleil.', 'Mes pétales jaunes forment un grand cercle.'] },
  { answer: 'bougie', hints: ['On m’allume pour créer une ambiance douce.', 'Je fonds petit à petit.', 'J’ai une petite flamme au bout d’une mèche.'] },
  { answer: 'cerf-volant', hints: ['On me fait voler avec un fil.', 'J’aime les jours de vent.', 'Mon nom contient un animal qui bondit dans la forêt.'] },
  { answer: 'confiture', hints: ['On m’étale sur une tartine.', 'Je suis faite de fruits et de sucre.', 'Je me garde dans un pot en verre.'] },
  { answer: 'hirondelle', hints: ['Je reviens chaque printemps.', 'Je suis un petit oiseau voyageur.', 'On dit que je ne fais pas le printemps à moi seule.'] },
  { answer: 'etoile filante', hints: ['On me voit traverser le ciel la nuit.', 'On dit qu’il faut faire un vœu en me voyant.', 'Je porte le nom d’un astre qui file.'] },
  { answer: 'aquarium', hints: ['Je suis rempli d’eau et de vie.', 'Des poissons y nagent tranquillement.', 'On me pose souvent dans un salon.'] },
  { answer: 'framboise', hints: ['Je suis un petit fruit rouge et sucré.', 'On me retrouve souvent en tarte ou en confiture.', 'Mon nom ressemble à un petit bruit malicieux.'] },
  { answer: 'nuage', hints: ['Je flotte très haut dans le ciel.', 'Je peux être blanc, gris ou rose au coucher du soleil.', 'Je suis fait de minuscules gouttes d’eau.'] },
  { answer: 'coquillage', hints: ['On me trouve souvent près de la mer.', 'Je peux garder le bruit des vagues dans les histoires.', 'Je protège parfois un petit animal marin.'] },
  { answer: 'montagne', hints: ['Je suis très grande et je touche parfois les nuages.', 'On peut me gravir ou me skier.', 'Mon sommet peut être couvert de neige.'] },
  { answer: 'guitare', hints: ['Je possède des cordes.', 'On me joue souvent autour d’un feu.', 'Mon corps est en bois et je peux accompagner une chanson.'] },
  { answer: 'mouton', hints: ['Je vis souvent en troupeau.', 'Ma laine tient chaud.', 'Je fais bêêê.'] },
  { answer: 'horloge', hints: ['Je mesure le passage du temps.', 'J’ai souvent des aiguilles.', 'Je peux être accrochée au mur.'] },
  { answer: 'glace', hints: ['Je suis froide et je fonds.', 'On me déguste parfois en cornet.', 'Je peux avoir le goût de vanille ou de fraise.'] },
  { answer: 'feuille', hints: ['Je pousse sur une plante ou un arbre.', 'Je peux devenir jaune en automne.', 'Elle transforme la lumière du soleil pour la plante.'] },
  { answer: 'ballon', hints: ['Je peux rebondir ou flotter.', 'On me lance pendant certains jeux.', 'Je suis souvent rond et rempli d’air.'] },
  { answer: 'escargot', hints: ['Je me déplace très lentement.', 'Je porte ma maison sur mon dos.', 'Je laisse parfois une trace brillante.'] },
  { answer: 'nuite etoilee', hints: ['Je suis un spectacle que l’on regarde vers le ciel.', 'Je brille grâce à de nombreux petits points lumineux.', 'Mon nom associe l’obscurité et les astres.'] },
  { answer: 'miel', hints: ['Je suis sucré et doré.', 'Je suis fabriqué par les abeilles.', 'On peut me verser sur des tartines.'] },
  { answer: 'boussole', hints: ['Je t’aide à trouver ton chemin.', 'Je possède une aiguille.', 'Elle indique notamment le nord.'] },
  { answer: 'miroir', hints: ['Je te montre ton reflet.', 'On me trouve souvent dans une salle de bain.', 'Je renvoie la lumière.'] },
  { answer: 'pluie', hints: ['Je tombe des nuages.', 'Je rends parfois les rues brillantes.', 'Je donne envie de sortir un parapluie.'] },
  { answer: 'gâteau', hints: ['Je suis souvent présent aux anniversaires.', 'Je peux porter des bougies.', 'Je suis fait avec une pâte sucrée.'] },
  { answer: 'hibou', hints: ['Je suis un oiseau qui veille souvent la nuit.', 'Mes grands yeux voient bien dans l’obscurité.', 'Mon cri ressemble à hou hou.'] },
  { answer: 'valise', hints: ['Je voyage avec toi.', 'Je contiens des vêtements.', 'J’ai souvent une poignée et des roulettes.'] },
  { answer: 'jardin', hints: ['On peut y faire pousser des fleurs.', 'Je peux être derrière une maison.', 'On y trouve parfois une pelouse et un potager.'] },
  { answer: 'tasse', hints: ['Je peux contenir une boisson chaude.', 'On me tient par une anse.', 'Je suis souvent posée près d’un livre.'] },
  { answer: 'fusée', hints: ['Je peux aller très haut dans le ciel.', 'Je transporte parfois des astronautes.', 'Je décolle avec beaucoup de feu et de fumée.'] },
  { answer: 'dauphin', hints: ['Je vis dans la mer.', 'Je suis connu pour être très joueur.', 'Je saute parfois hors de l’eau.'] },
  { answer: 'goutte', hints: ['Je suis petite et ronde.', 'Je peux tomber d’un nuage ou d’un robinet.', 'Je fais partie de l’eau.'] },
  { answer: 'oreiller', hints: ['Je t’accompagne pendant la nuit.', 'Ma place est souvent sur un lit.', 'Je soutiens ta tête quand tu dors.'] },
  { answer: 'cerise', hints: ['Je suis un petit fruit rouge.', 'Je pousse par paire sur un arbre.', 'J’ai un noyau et une longue queue.'] },
  { answer: 'chemin', hints: ['Je relie souvent deux endroits.', 'On peut me suivre à pied.', 'Je traverse parfois une forêt ou un jardin.'] },
  { answer: 'lanterne', hints: ['Je produis ou protège une petite lumière.', 'Je peux décorer une terrasse.', 'On m’emporte parfois pour éclairer la nuit.'] },
  { answer: 'puzzle', hints: ['Je suis composé de pièces.', 'Il faut les assembler pour me terminer.', 'Mon image apparaît petit à petit.'] },
  { answer: 'souris', hints: ['Je suis un petit animal.', 'J’aime parfois le fromage dans les histoires.', 'Je peux me déplacer très discrètement.'] },
  { answer: 'parfum', hints: ['Je ne me vois pas mais je me sens.', 'Je peux rappeler une fleur ou un fruit.', 'On me porte parfois sur la peau.'] },
  { answer: 'plume', hints: ['Je suis légère et douce.', 'Je recouvre le corps des oiseaux.', 'Je peux tomber d’une aile.'] },
  { answer: 'écharpe', hints: ['Je protège ton cou du froid.', 'Je peux être longue et colorée.', 'On me porte souvent en hiver.'] },
  { answer: 'bulle', hints: ['Je suis ronde et très légère.', 'Je peux éclater en un instant.', 'On peut me souffler avec du savon.'] },
  { answer: 'cartable', hints: ['Je transporte des affaires.', 'On l’emporte souvent à l’école.', 'Il peut contenir des cahiers et des crayons.'] },
  { answer: 'abricot', hints: ['Je suis un fruit d’été à la peau douce.', 'Mon noyau est dur et se cache au milieu.', 'Je suis orange et mon nom commence par a.'] },
  { answer: 'tortue', hints: ['Je prends mon temps pour avancer.', 'Je peux vivre sur terre ou dans l’eau.', 'Je porte une carapace.'] },
  { answer: 'réveil', hints: ['Je t’aide à commencer la journée.', 'Je peux sonner à une heure choisie.', 'On m’arrête souvent dès le matin.'] },
  { answer: 'cheminée', hints: ['Je fais partie de certaines maisons.', 'La fumée peut passer par moi.', 'On y voit parfois un feu en hiver.'] },
  { answer: 'neige', hints: ['Je tombe quand il fait très froid.', 'Je recouvre parfois les toits et les jardins.', 'Je suis blanche et on peut me façonner en boule.'] },
  { answer: 'renard', hints: ['Je vis souvent dans les bois.', 'J’ai une queue touffue.', 'Dans les histoires, je suis réputé rusé.'] },
  { answer: 'piano', hints: ['Je suis un instrument de musique.', 'J’ai des touches blanches et noires.', 'On me joue avec les deux mains.'] },
  { answer: 'escalier', hints: ['Je relie souvent deux étages.', 'On me monte marche après marche.', 'Je peux avoir une rampe.'] },
  { answer: 'citron', hints: ['Je suis un agrume.', 'Mon jus est souvent très acidulé.', 'Ma peau est jaune.'] },
  { answer: 'abeille', hints: ['Je visite les fleurs.', 'Je vis dans une ruche avec d’autres.', 'Je fabrique du miel.'] },
  { answer: 'bateau', hints: ['Je peux voyager sur l’eau.', 'J’ai parfois une voile ou un moteur.', 'Je transporte des personnes ou des marchandises sur la mer.'] },
  { answer: 'chaussette', hints: ['Je vais souvent par deux.', 'Je garde les pieds au chaud.', 'On me met avant les chaussures.'] },
  { answer: 'coussin', hints: ['Je rends un siège plus confortable.', 'Je peux être moelleux et décoratif.', 'On pose parfois sa tête dessus pour se reposer.'] },
  { answer: 'bretzel', hints: ['Je suis une spécialité salée.', 'Ma forme est nouée.', 'On me reconnaît à ma croûte dorée et à mes grains de sel.'] },
  { answer: 'météore', hints: ['Je traverse parfois le ciel nocturne.', 'Je laisse une trace lumineuse en entrant dans l’atmosphère.', 'On me confond parfois avec une étoile filante.'] },
  { answer: 'banane', hints: ['Je suis un fruit facile à emporter.', 'Ma peau s’enlève avant de me manger.', 'Je suis longue et jaune.'] },
  { answer: 'cloche', hints: ['Je peux annoncer un moment important.', 'On me fait sonner.', 'Je suis souvent en métal et ma forme est arrondie.'] },
  { answer: 'violon', hints: ['Je suis un instrument à cordes.', 'On me joue avec un archet.', 'Mon son peut être doux ou très énergique.'] },
  { answer: 'poussin', hints: ['Je suis un tout jeune animal de la ferme.', 'Je sors d’un œuf.', 'Je suis petit, jaune et couvert de duvet.'] },
  { answer: 'cadenas', hints: ['Je protège parfois une porte ou une boîte.', 'Il faut une clé ou un code pour m’ouvrir.', 'Je possède un arceau métallique qui se referme.'] },
];

export function getRandomPrompt(
  category: PromptCategory,
  kind: PromptKind,
  previousId?: string,
  random: () => number = Math.random,
  additionalPrompts: readonly GamePrompt[] = [],
): GamePrompt {
  const pool = [
    ...gamePrompts.filter((item) => item.category === category && item.kind === kind),
    ...additionalPrompts.filter((item) => item.category === category && item.kind === kind),
  ];
  const fresh = pool.filter((item) => item.id !== previousId);
  const candidates = fresh.length > 0 ? fresh : pool;
  const sample = Math.max(0, Math.min(0.999999999, random()));
  const index = Math.floor(sample * candidates.length);
  return candidates[index];
}

export function getLocalDayNumber(date: Date = new Date()): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function getDailyIndex(length: number, date: Date = new Date(), salt = 0): number {
  if (length <= 0) return 0;
  return Math.abs(getLocalDayNumber(date) + salt) % length;
}

export function getSessionQuestionIndex(startIndex: number, sessionPosition: number, questionCount: number): number {
  if (questionCount <= 0) return 0;
  return (startIndex + sessionPosition) % questionCount;
}

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr-FR')
    .replace(/[^a-z0-9]/g, '');
}

export function isCorrectWordGuess(input: string, answer: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(answer);
}

export type WordGuessOutcome = 'correct' | 'incorrect' | 'out-of-attempts';

export function evaluateWordGuess(input: string, answer: string, attemptsRemaining: number): WordGuessOutcome {
  if (isCorrectWordGuess(input, answer)) return 'correct';
  return attemptsRemaining <= 1 ? 'out-of-attempts' : 'incorrect';
}

export function getPersonalityOutcome(answers: readonly PersonalityType[]): PersonalityType {
  const counts = new Map<PersonalityType, number>();
  for (const answer of answers) counts.set(answer, (counts.get(answer) ?? 0) + 1);

  return (Object.keys(personalityProfiles) as PersonalityType[]).reduce((leader, candidate) =>
    (counts.get(candidate) ?? 0) > (counts.get(leader) ?? 0) ? candidate : leader,
  'rayon');
}

export function didCompleteTimedChallenge(taps: number, target: number, secondsRemaining: number): boolean {
  return taps >= target && secondsRemaining > 0;
}
