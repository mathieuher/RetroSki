import { Color, EmitterType, GpuParticleEmitter, ParticleEmitter, vec } from 'excalibur';

export class ParticlesBuilder {
    public static getGpuParticlesEmitter(side: 'left' | 'right'): GpuParticleEmitter {
        return new GpuParticleEmitter({
            pos: vec(side === 'left' ? -8 : 8, -4),
            emitterType: EmitterType.Circle,
            radius: 1,
            emitRate: 100,
            maxParticles: 10_000,
            isEmitting: false,
            particle: {
                minSpeed: 0,
                maxSpeed: 10,
                minAngle: side === 'left' ? 3 : 0.1,
                maxAngle: side === 'left' ? 3 : 0.1,
                life: 3000,
                startSize: 4,
                endSize: 1,
                beginColor: Color.fromRGB(120, 194, 250),
                endColor: Color.Transparent,
                opacity: 0.5
            }
        });
    }
}
