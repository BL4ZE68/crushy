import { Mood } from '../store/useCrushyStore';

export type DailyContent = {
  quote: string;
  joke: string;
  challenge: string;
  thought: string;
  question: string;
};

const dailyContent: Record<Mood, DailyContent[]> = {
  heureuse: [
    {
      quote: 'La joie grandit quand on lui fait une petite place.',
      joke: 'Que dit une feuille à une autre feuille ? On se retrouve au printemps !',
      challenge: 'Partage une bonne nouvelle, même toute petite.',
      thought: 'Ton sourire du jour mérite aussi un peu de repos.',
      question: 'Quel petit plaisir pourrait rendre ta journée encore meilleure ?',
    },
    {
      quote: 'Les beaux jours commencent parfois par un détail.',
      joke: 'Pourquoi les poissons n’aiment-ils pas l’ordinateur ? À cause du net.',
      challenge: 'Prends une photo mentale d’un moment qui te plaît.',
      thought: 'Tu peux être fière de profiter de ce qui va bien.',
      question: 'Si ta bonne humeur avait une couleur, laquelle serait-elle ?',
    },
  ],
  triste: [
    {
      quote: 'Tu n’as pas besoin d’aller vite pour avancer.',
      joke: 'Qu’est-ce qui est jaune et qui attend ? Jonathan.',
      challenge: 'Fais une chose douce pour toi, sans chercher à tout régler.',
      thought: 'Un jour difficile ne résume pas toute ton histoire.',
      question: 'Qu’est-ce qui te ferait du bien dans les dix prochaines minutes ?',
    },
    {
      quote: 'Même les nuages laissent passer un peu de lumière.',
      joke: 'Pourquoi les livres ont-ils toujours chaud ? Parce qu’ils ont une couverture.',
      challenge: 'Bois un verre d’eau et offre-toi une vraie pause.',
      thought: 'Tu mérites de la patience, surtout de la tienne.',
      question: 'Quelle personne ou quel endroit te donne un sentiment de sécurité ?',
    },
  ],
  amoureuse: [
    {
      quote: 'La tendresse se cache souvent dans les petites attentions.',
      joke: 'Quelle est la fleur la plus romantique ? La rose, évidemment.',
      challenge: 'Pense à un geste tendre que tu aimerais offrir ou recevoir.',
      thought: 'La douceur que tu donnes compte aussi quand tu la gardes pour toi.',
      question: 'Quel serait ton rendez-vous parfait, même tout simple ?',
    },
    {
      quote: 'Les liens précieux se tissent un petit moment à la fois.',
      joke: 'Pourquoi les amoureux aiment-ils les maths ? Ils cherchent leur moitié.',
      challenge: 'Écris un compliment sincère, pour quelqu’un ou pour toi.',
      thought: 'Tu as le droit de rêver avec le cœur léger.',
      question: 'Quelle petite attention te touche le plus ?',
    },
  ],
  énergique: [
    {
      quote: 'Ton élan peut devenir une aventure, un pas après l’autre.',
      joke: 'Quel est le comble pour un électricien ? De ne pas être au courant.',
      challenge: 'Bouge ou danse sur une chanson pendant une minute.',
      thought: 'Tu peux choisir où placer ton énergie, et aussi quand faire une pause.',
      question: 'Quelle idée te donne envie de te lancer aujourd’hui ?',
    },
    {
      quote: 'Une grande idée commence souvent par un premier geste.',
      joke: 'Pourquoi les cyclistes aiment-ils l’été ? Pour pédaler dans la bonne humeur.',
      challenge: 'Termine une petite tâche que tu repousses depuis quelques jours.',
      thought: 'Ton enthousiasme est beau quand il reste à ton rythme.',
      question: 'Si tu pouvais apprendre quelque chose aujourd’hui, quoi ?',
    },
  ],
  fatiguée: [
    {
      quote: 'Le repos fait partie du chemin, pas de son contraire.',
      joke: 'Pourquoi les oreillers sont-ils si calmes ? Ils savent garder la tête froide.',
      challenge: 'Éloigne ton écran une minute et relâche les épaules.',
      thought: 'Tu n’as pas besoin de mériter une pause.',
      question: 'Qu’est-ce que tu pourrais remettre à plus tard sans culpabiliser ?',
    },
    {
      quote: 'Aujourd’hui, le minimum peut être exactement ce qu’il faut.',
      joke: 'Quel animal adore dormir ? Le paresseux, il en connaît un rayon.',
      challenge: 'Choisis une seule priorité pour la suite de ta journée.',
      thought: 'Ta valeur ne dépend pas de ta liste de choses à faire.',
      question: 'Quel petit confort te ferait du bien ce soir ?',
    },
  ],
  rêveuse: [
    {
      quote: 'L’imagination sait ouvrir des fenêtres partout.',
      joke: 'Pourquoi les étoiles ne se perdent-elles jamais ? Elles suivent leur voie lactée.',
      challenge: 'Invente le titre d’un livre sur ta journée.',
      thought: 'Tes idées ont le droit d’être curieuses avant d’être utiles.',
      question: 'Si tu pouvais visiter un monde imaginaire, lequel choisirais-tu ?',
    },
    {
      quote: 'Les idées vagabondes font parfois les plus jolies découvertes.',
      joke: 'Quel est le métier préféré des nuages ? Cumulus-icien.',
      challenge: 'Dessine dans l’air la forme d’un objet complètement inventé.',
      thought: 'Garde un peu de place pour ce qui te fait rêver.',
      question: 'Quel pouvoir magique serait le plus pratique au quotidien ?',
    },
  ],
};

function getLocalDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function getDailyContent(mood: Mood, date: Date): DailyContent {
  const options = dailyContent[mood];
  return options[getLocalDayNumber(date) % options.length];
}
