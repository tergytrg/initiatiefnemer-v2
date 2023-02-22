# initiatiefnemer
Een bot voor dnd inititative rolls.

## Gebruikershandleiding
### 1. Downloaden
Download de bovenstaande bestanden zoals gebruikelijk: via git, of als zip-bestand.

Download ook NodeJS: https://nodejs.org/en/download/

### 2. Instellen
Voeg een zogeheten `dotenv` bestand toe. Dit bestand heeft geen naam, en een .env extensie. Hij zal dus gewoon `.env` heten, zonder de aanhalingstekens. Je kunt dit bestand maken door bijvoorbeeld in nodepad een bestand op te slaan genaamd ".env". Hieronder volgt een voorbeeld van de instellingen die in dat bestand moeten staan. 

```
CHANNEL="1234567890"
token="t0K3nStR1Ng_t0K3nStR1Ng_t0K3nStR1Ng_t0K3nStR1Ng"
clientId="2345678901"
guildId="3456789012"
```

`CHANNEL` is het ID van het discord-kanaal waar je de initiative rolls in wil krijgen. Extra info: https://docs.statbot.net/docs/faq/general/how-find-id/#:~:text=To%20get%20a%20Channel%20ID,the%20number%20is%20the%20ID.

`token` is de token van de discord applicatie. Hiervoor moet je in de discord developer portal een applicatie aanmaken, dit wordt het account van de bot. Extra info: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot

`clientId` is het ID van de bot. Deze is op ongeveer dezelfde plek te vinden als de token.

`guildId` is het ID van de discord-server/-guild waar je de bot wilt gebruiken. De bot is namelijk gemaakt voor een enkele server.

### 3. Gebruiken!
Op sommige besturingssystemen hoef je alleen maar het bestand `start.bat` te openen, en dan zou de bot moeten werken! Als dat niet werkt, moet je een terminal openen en het commando `node .` gebruiken. Veel plezier!
