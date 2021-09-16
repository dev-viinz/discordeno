import { avatarUrl } from "../helpers/user/avatar_url.ts";
import { Embed } from "../types/channel/messages/embeds/embed.ts";
import { User } from "../types/user/user.ts";

const embedLimits = {
  title: 256,
  description: 4096,
  fieldName: 256,
  fieldValue: 1024,
  footerText: 2048,
  authorName: 256,
  fields: 25,
  total: 6000,
};

export class Embeds extends Array<Embed> {
  /** The amount of characters in the embed. */
  currentTotal = 0;
  /** Whether the limits should be enforced or not. */
  enforceLimits = true;
  /** If a file is attached to the message it will be added here. */
  file?: EmbedFile;

  constructor(enforceLimits = true) {
    super();
    // By default we will always want to enforce discord limits but this option allows us to bypass for whatever reason.
    if (!enforceLimits) this.enforceLimits = false;

    return this;
  }

  fitData(data: string, max: number) {
    // If the string is bigger then the allowed max shorten it.
    if (data.length > max) data = data.substring(0, max);
    // Check the amount of characters left for this embed
    const availableCharacters = embedLimits.total - this.currentTotal;
    // If it is maxed out already return empty string as nothing can be added anymore
    if (!availableCharacters) return ``;
    // If the string breaks the maximum embed limit then shorten it.
    if (this.currentTotal + data.length > embedLimits.total) {
      return data.substring(0, availableCharacters);
    }
    // Return the data as is with no changes.
    return data;
  }

  setAuthor(name: string, iconUrlOrUser?: string | User, url?: string) {
    const embed = this.#getLastEmbed();
    const finalName = this.enforceLimits
      ? this.fitData(name, embedLimits.authorName)
      : name;

    if (typeof iconUrlOrUser === "string") {
      embed.author = { name: finalName, iconUrl: iconUrlOrUser, url };
    } else if (iconUrlOrUser) {
      embed.author = {
        name: finalName,
        iconUrl: avatarUrl(iconUrlOrUser),
        url,
      };
    } else {
      embed.author = { name: finalName, url };
    }

    return this;
  }

  setColor(color: string) {
    this.#getLastEmbed().color =
      color.toLowerCase() === `random`
        ? // Random color
          Math.floor(Math.random() * (0xffffff + 1))
        : // Convert the hex to a acceptable color for discord
          parseInt(color.replace("#", ""), 16);

    return this;
  }

  setDescription(description: string | string[]) {
    if (Array.isArray(description)) description = description.join("\n");
    this.#getLastEmbed().description = this.fitData(
      description,
      embedLimits.description
    );

    return this;
  }

  addField(name: string, value: string, inline = false) {
    const embed = this.#getLastEmbed();

    if (embed.fields!.length >= 25) return this;

    embed.fields!.push({
      name: this.fitData(name, embedLimits.fieldName),
      value: this.fitData(value, embedLimits.fieldValue),
      inline,
    });

    return this;
  }

  addBlankField(inline = false) {
    return this.addField("\u200B", "\u200B", inline);
  }

  attachFile(file: unknown, name: string) {
    this.file = {
      blob: file,
      name,
    };
    this.setImage(`attachment://${name}`);

    return this;
  }

  setFooter(text: string, icon?: string) {
    this.#getLastEmbed().footer = {
      text: this.fitData(text, embedLimits.footerText),
      iconUrl: icon,
    };

    return this;
  }

  setImage(urlOrUser: string | User) {
    if (typeof urlOrUser === "string")
      this.#getLastEmbed().image = { url: urlOrUser };
    else {
      this.#getLastEmbed().image = {
        url: avatarUrl(urlOrUser, {
          size: 2048,
        }),
      };
    }

    return this;
  }

  setTimestamp(time = Date.now()) {
    // TODO: fix this type
    // @ts-ignore -
    this.#getLastEmbed().timestamp = new Date(time).toISOString();

    return this;
  }

  setTitle(title: string, url?: string) {
    this.#getLastEmbed().title = this.fitData(title, embedLimits.title);
    if (url) this.#getLastEmbed().url = url;

    return this;
  }

  setThumbnail(url: string) {
    this.#getLastEmbed().thumbnail = { url };

    return this;
  }

  addEmbed(embed?: Embed) {
    if (this.length === 10) return this;

    this.push({ ...embed, fields: embed?.fields ?? [] });

    return this;
  }

  /** Get the last Embed, if there is no it will create one */
  #getLastEmbed() {
    if (this.length) return this[this.length - 1];

    this.push({
      fields: [],
    });

    return this[0];
  }
}

export interface EmbedFile {
  blob: unknown;
  name: string;
}

export default Embeds;
