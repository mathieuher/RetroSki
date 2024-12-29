export class FormatterUtils {
    public static valueFormatter(value: string | undefined, format: 'name' | 'lower' | 'upper'): string | undefined {
        if (value) {
            switch (format) {
                case 'name':
                    return value[0]?.toLocaleUpperCase() + value.slice(1);
                case 'lower':
                    return value.toLocaleLowerCase();
                case 'upper':
                    return value.toLocaleUpperCase();
            }
        }
        return undefined;
    }
}
