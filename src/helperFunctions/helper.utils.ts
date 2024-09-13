export class BaseHelper {
    static generateOtp(): number {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }

    static generateKey(): string {

        const characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+|.<>?';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < 10; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
          );
        }

        return result;
    }

   
}