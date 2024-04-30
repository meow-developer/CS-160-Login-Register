import axios, { AxiosResponse } from 'axios';
import { createHash } from 'crypto';

class CheckPasswordPwnedError extends Error {
    public constructor(message: string) {
        super(message);
    }
}

export default class CheckPasswordPwned {
    private PASSWORD_THRESHOLD = 10;

    private getPasswordHashPrefixSuffix(password: string): Array<string> {
        const hash = createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);
        return [ prefix, suffix ];
    }
    private async getPwnedPasswordHashes(prefix: string): Promise<string> {
        const PASSWORD_PWNED_API_URL = 'https://api.pwnedpasswords.com/range/';
        try {
            const response: AxiosResponse<string> = await axios.get<string>(`${PASSWORD_PWNED_API_URL}${prefix}`, {
                headers: {
                    'Add-Padding': true
                }
            });
            return response.data;
        } catch (err) {
            throw new CheckPasswordPwnedError('Error retrieving password hash list from Pwned Passwords API.');
        }
    }

    private parsePasswordOccurrence (suffix: string, hashListData: string): number {
        const hashEntries = hashListData.split('\r\n');
        const matchingHash = hashEntries.find(h => {
            const parts = h.split(':');
            return parts[0] === suffix;
        });

        if (matchingHash) {
            const occurrences = matchingHash.split(':')[1];
            return parseInt(occurrences);
        } else {
            return 0;
        }
    }

    private checkPasswordExceedThreshold(occurrences: number): boolean {
        return occurrences > this.PASSWORD_THRESHOLD;
    }

    public async verifyPasswordSafety(password: string): Promise<boolean> {
        const [ prefix, suffix ] = this.getPasswordHashPrefixSuffix(password);
        const hashListData = await this.getPwnedPasswordHashes(prefix);
        const occurrences = this.parsePasswordOccurrence(suffix, hashListData);
        return this.checkPasswordExceedThreshold(occurrences);
    }

}