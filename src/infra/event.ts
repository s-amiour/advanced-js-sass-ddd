import { DomainEvent } from "../domain/events"

// Event Dispatcher (Mediator / Middleman)
type Handler<T> = (event: T) => void

class EventDispatcher {
    private handlers: Map<string, Handler<unknown>[]> = new Map()

    sub<T>(eventType: string, handler: Handler<T>) {
        const observers = this.handlers.get(eventType) ?? []
        this.handlers.set(eventType, [...observers, handler as Handler<unknown>])
    }

    unsub<T>(eventType: string, handler: Handler<T>) {
        const observers = this.handlers.get(eventType) ?? []
        this.handlers.set(eventType, observers.filter(h => h !== (handler as Handler<unknown>)))
    }

    dispatch<T>(eventType: string, payload: T) {
        const observers = this.handlers.get(eventType) ?? []
        observers.forEach(h => h(payload))
    }
}

const eventDispatcher = new EventDispatcher()
type EventType = DomainEvent["type"]
type EventPayload<T extends EventType> = Extract<DomainEvent, { type: T }>["payload"]

export const domainEvents = {
    sub<T extends EventType>(eventType: T, handler: (event: EventPayload<T>) => void) {
        eventDispatcher.sub<EventPayload<T>>(eventType, handler)
    },
    unsub<T extends EventType>(eventType: T, handler: (event: EventPayload<T>) => void) {
        eventDispatcher.unsub<EventPayload<T>>(eventType, handler)
    },
    dispatch<T extends EventType>(eventType: T, payload: EventPayload<T>) {
        eventDispatcher.dispatch<EventPayload<T>>(eventType, payload)
    }
}
