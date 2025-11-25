import { Color, EmitterType, GpuParticleEmitter, ParticleEmitter, vec } from 'excalibur';

export class ParticlesBuilder {
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
                maxSpeed: 100,
                minAngle: side === 'left' ? 3 : 0.1,
                maxAngle: side === 'left' ? 3 : 0.1,
                life: 1300,
                startSize: 2,
                endSize: 0,
                opacity: 0.4,
                endColor: Color.Transparent
            }
        });
    }
}
