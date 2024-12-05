import { Color, EmitterType, ParticleEmitter, vec } from 'excalibur';

export class ParticlesBuilder {
    public static getParticlesEmitter(): ParticleEmitter {
        return new ParticleEmitter({
            pos: vec(0, -20),
            emitterType: EmitterType.Circle,
            radius: 1,
            minVel: 1,
            maxVel: 10,
            minAngle: 3.4,
            maxAngle: 6,
            emitRate: 1,
            opacity: 0.7,
            fadeFlag: true,
            particleLife: 2000,
            maxSize: 5,
            minSize: 5,
            startSize: 5,
            endSize: 1,
            beginColor: Color.fromRGB(23, 106, 170, 0.1),
            endColor: Color.Transparent,
            isEmitting: false
        });
    }
}
