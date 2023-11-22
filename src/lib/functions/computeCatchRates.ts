import { Ailment } from "$lib/constants/ailments";
import { Ball } from "$lib/constants/pokeballs";

/* Generation 1 Computing Methods */
const gen1F = (mHp: number, cHp: number, ball: number) => (mHp * 255 * 4) / (cHp * ball);
const simulateFailShakes = (catchRate: number, ballBonus: number, ailmentBonus: number, fResult: number) => {
    const D = (catchRate * 100) / ballBonus;

    if (D >= 256) {
        return 3
    }

    const X = ((D * fResult) / 255) + ailmentBonus;

    return X < 10 ? 0 : X < 30 ? 1 : X < 70 ? 2 : 3
}

export const simulateCatchGen1 = (conditions: any) => {
    const { ballId, ailmentId, catchRate, maxHp, curHp } = conditions;

    if (ballId === Ball.MasterBall) {
        return { catch: true, shakes: 3 };
    };


    const ballBonus = ballId === Ball.GreatBall ? 12 : 8;
    const ballThreshold = ballId === Ball.PokeBall ? 255 : ballId === Ball.GreatBall ? 200 : 150;
    const [ailmentThreshold, ailmentBonus] = [Ailment.Freeze, Ailment.Sleep].includes(ailmentId) ? [25, 10] :
        [Ailment.Paralysis, Ailment.Burn, Ailment.Poison].includes(ailmentId) ? [12, 5] : [0, 0];

    const M = Math.trunc(Math.random() * 255);
    const N = Math.trunc(Math.random() * ballThreshold);

    if (N < ailmentThreshold) {
        return { catch: true, shakes: 3 };
    }

    if ((N - ailmentThreshold) > catchRate) {
        return { catch: false, shakes: simulateFailShakes(catchRate, ballThreshold, ailmentBonus, f) };
    }

    const f = gen1F(maxHp, curHp, ballBonus);

    if (f >= M) {
        return { catch: true, shakes: 3 };
    } else {
        return { catch: false, shakes: simulateFailShakes(catchRate, ballThreshold, ailmentBonus, f) }
    }
}

const computeCatchRateGen1 = (conditions: any) => {
    const { ballId, ailmentId, catchRate, maxHp, curHp } = conditions;

    if (ballId === Ball.MasterBall) return 100;

    const ballBonus = ballId === Ball.GreatBall ? 12 : 8;
    const ballMod = ballId === Ball.PokeBall ? 255 : ballId === Ball.GreatBall ? 200 : 150;
    const ailmentMod = [Ailment.Freeze, Ailment.Sleep].includes(ailmentId) ? 25 :
        [Ailment.Paralysis, Ailment.Burn, Ailment.Poison].includes(ailmentId) ? 12 : 0;

    const p0 = ailmentMod / (ballMod + 1);
    const p1 = ((catchRate + 1) / (ballMod + 1)) * ((gen1F(maxHp, curHp, ballBonus) + 1) / 256);
    return (p0 + p1).toFixed(2)
}


/* Main Logic Decision tree */
export const computeCatchRate = (genId: number, conditions: any) => [
    { gen: 1, func: (conditions: any) => computeCatchRateGen1(conditions) }
].find(elem => elem.gen === genId)?.func(conditions);