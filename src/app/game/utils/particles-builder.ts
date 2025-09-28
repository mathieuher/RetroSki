import { Color, EmitterType, GpuParticleEmitter, ParticleEmitter, vec } from 'excalibur';

export class ParticlesBuilder {
    public static getCpuParticlesEmitter(side: 'left' | 'right'): ParticleEmitter {
        return new ParticleEmitter({
            pos: vec(side === 'left' ? -8 : 8, -4),
            emitterType: EmitterType.Circle,
            radius: 1,
            emitRate: 100,
            isEmitting: true,
            particle: {
                minSpeed: 0,
                maxSpeed: 10,
                minAngle: side === 'left' ? 3 : 0.1,
                maxAngle: side === 'left' ? 3 : 0.1,
                life: 1000,
                maxSize: 4,
                minSize: 1,
                startSize: 4,
                endSize: 1,
                beginColor: Color.fromRGB(120, 194, 250),
                endColor: Color.Transparent,
                opacity: 0.7
            }
        });
    }

    public static getGpuParticlesEmitter(side: 'left' | 'right'): GpuParticleEmitter {
        return new GpuParticleEmitter({
            pos: vec(side === 'left' ? -8 : 8, -4),
            emitterType: EmitterType.Circle,
            radius: 1,
            emitRate: 100,
            maxParticles: 5_000,
            isEmitting: false,
            particle: {
                minSpeed: 0,
                maxSpeed: 10,
                minAngle: side === 'left' ? 3 : 0.1,
                maxAngle: side === 'left' ? 3 : 0.1,
                life: 1800,
                maxSize: 2,
                minSize: 1,
                startSize: 2,
                endSize: 1,
                beginColor: Color.fromRGB(120, 194, 250, 0.8),
                endColor: Color.Transparent
            }
        });
    }
}
