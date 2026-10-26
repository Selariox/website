/* Connexion partagée par toutes les pages. Ne pas modifier sauf besoin précis. */
window.Auth={
  sb:null,
  init(){
    const c=window.APP_CONFIG||{};
    if(!window.supabase||!c.url||!c.key||/^COLLE/.test(c.url)||/^COLLE/.test(c.key)){
      document.body.innerHTML='<main><h1>Presque prêt</h1><p class="sub">Ouvre le fichier config.js et remplace les deux valeurs par celles de ton projet Supabase. Si c’est déjà fait, vérifie ta connexion Internet et recharge la page.</p></main>';
      return null;
    }
    return this.sb=supabase.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true}});
  },
  async user(){const{data:{session}}=await this.sb.auth.getSession();return session?session.user:null},
  async guard(){ // à appeler en tête de chaque page d'outil
    if(!this.init())return null;
    const u=await this.user();
    if(!u){location.replace('index.html');return null}
    return u;
  },
  async out(){try{await this.sb.auth.signOut()}finally{location.replace('index.html')}}
};
