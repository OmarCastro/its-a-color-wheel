export function dedent (templateStrings: string | string[], ...values: unknown[]) {
    const matches = [];
	const strings = typeof templateStrings === 'string' ? [ templateStrings ] : templateStrings.slice();
	strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, '');
	for (const string of strings) {
		const match = string.match(/\n[\t ]+/g)
        match && matches.push(...match);
	}
	if (matches.length) {
		const size = Math.min(...matches.map(value => value.length - 1));
		const pattern = new RegExp(`\n[\t ]{${size}}`, 'g');
		for (let i = 0; i < strings.length; i++) {
			strings[i] = strings[i].replace(pattern, '\n');
		}
	}

	strings[0] = strings[0].replace(/^\r?\n/, '');
	let string = strings[0];
	for (let i = 0; i < values.length; i++) {
		string += values[i] + strings[i + 1];
	}
	return string;
}

export default dedent