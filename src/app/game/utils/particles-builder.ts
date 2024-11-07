import { Color, EmitterType, ParticleEmitter, vec } from 'excalibur';

export class ParticlesBuilder {
	public static getParticlesEmitter(): ParticleEmitter {
		const emitter = new ParticleEmitter({
			pos: vec(0, -20),
			emitterType: EmitterType.Circle,
			radius: 6,
			minVel: 50,
			maxVel: 200,
			minAngle: 3.4,
			maxAngle: 6,
			emitRate: 400,
			opacity: 0.5,
			fadeFlag: true,
			particleLife: 1200,
			maxSize: 4,
			minSize: 0.75,
			beginColor: Color.ExcaliburBlue,
			isEmitting: false,
		});
		return emitter;
	}
}
