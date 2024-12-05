import { Color, EmitterType, GpuParticleEmitter, ParticleEmitter, vec } from 'excalibur';

export class ParticlesBuilder {
    public static getParticlesEmitter(): ParticleEmitter {
        return new ParticleEmitter({
            pos: vec(0, -20),
            emitterType: EmitterType.Circle,
            particle: {
                minSpeed: 1,
                maxSpeed: 10,
                minAngle: 3.4,
                maxAngle: 6,
                opacity: 0.7,
                life: 1000,
                maxSize: 5,
                minSize: 5,
                startSize: 5,
                endSize: 1,
                beginColor: Color.fromRGB(23, 106, 170, 0.1),
                endColor: Color.Transparent
            },
            radius: 1,
            emitRate: 1,
            isEmitting: false
        });
    }

    public static getGpuParticlesEmitter(): GpuParticleEmitter {
        return new GpuParticleEmitter({
            pos: vec(0, -20),
            emitterType: EmitterType.Circle,
            maxParticles: 1000,
            particle: {
                minSpeed: 1,
                maxSpeed: 10,
                minAngle: 3.4,
                maxAngle: 6,
                opacity: 0.7,
                life: 2000,
                maxSize: 5,
                minSize: 5,
                startSize: 5,
                endSize: 1,
                beginColor: Color.fromRGB(23, 106, 170, 0.1),
                endColor: Color.Transparent
            },
            radius: 1,
            emitRate: 1,
            isEmitting: false
        });
    }
}
