const socialLogos = {
  steam: 'assets/logos/steam.png',
  spotify: 'assets/logos/spotify.png',
  youtube: 'assets/logos/youtube.png',
  discord: 'assets/logos/discord.png',
  instagram: 'assets/logos/instagram.png',
  twitter: 'assets/logos/x.png',
  letterboxd: 'assets/logos/letterboxd.png',
  onlyfans: 'assets/logos/onlyfans.png',
  behance: 'assets/logos/behance.png',
  pinterest: 'assets/logos/pinterest.png',
  tumblr: 'assets/logos/tumblr.png',
  vercel: 'assets/logos/vercel.png',
  dribbble: 'assets/logos/dribbble.png',
  valorant: 'assets/logos/valorant.png'
};

const socialUrls = {
  steam: val => `https://steamcommunity.com/id/${val}`,
  spotify: val => `https://open.spotify.com/user/${val}`,
  youtube: val => `https://youtube.com/${val.startsWith('@') ? val : '@' + val}`,
  discord: val => `https://discord.com/users/${val}`,
  instagram: val => `https://instagram.com/${val.replace(/^@/, '')}`,
  twitter: val => `https://twitter.com/${val.replace(/^@/, '')}`,
  letterboxd: val => `https://letterboxd.com/${val}`,
  onlyfans: val => `https://onlyfans.com/${val.replace(/^@/, '')}`,
  behance: val => `https://behance.net/${val}`,
  pinterest: val => `https://pinterest.com/${val}`,
  tumblr: val => `https://${val}.tumblr.com`,
  vercel: val => `https://${val}.vercel.app`,
  dribbble: val => `https://dribbble.com/${val}`,
  valorant: val => `https://tracker.gg/valorant/profile/riot/${val}`
};
