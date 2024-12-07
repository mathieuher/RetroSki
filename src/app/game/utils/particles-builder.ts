import { Color, EmitterType, ParticleEmitter, vec } from "excalibur";

export class ParticlesBuilder {
    public static getCpuParticlesEmitter(side: 'left' | 'right'): ParticleEmitter {
        return new ParticleEmitter({
            pos: vec(side === 'left' ? -8 : 8, -4),
            emitterType: EmitterType.Circle,
            radius: 1,
            emitRate: 1,
            isEmitting: false,
            minVel: 0,
            maxVel: 10,
            minAngle: side === 'left' ? 3 : 0.1,
            maxAngle: side === 'left' ? 3 : 0.1,
            particleLife: 1000,
            opacity: 0.7,
            maxSize: 3,
            minSize: 1,
            startSize: 4,
            endSize: 1,
            beginColor: Color.fromRGB(23, 106, 170, 0.1),
            endColor: Color.Transparent,
        });
    }
}