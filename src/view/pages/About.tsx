import React from 'react';
import { Link } from 'react-router-dom';

export function About() {
  return <article>
    <h1>About</h1>
    <section>
      Hey, I'm kirilloid. I play and <Link to="https://sourcegaming.info/2017/07/21/an-introduction-to-video-game-data-mining/">data-mine</Link> Valheim.<br />
      I work on this project in my free-time. It's open-source, you can find code on <Link to="https://github.com/kirilloid/valheim">GitHub</Link>.<br />
      If you have any questions, suggestions or other comments, you can find me on <Link to="https://discord.gg/valheim">official Valheim Discord server</Link> by same nickname: kirilloid.
    </section>
  </article>
}