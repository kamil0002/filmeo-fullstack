<?php

namespace App\Events;

use DateTime;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */

    public function __construct(
        public string $senderName,
        public string $senderId,
        public string $senderAvatar,
        public DateTime $date,
        public string $message
    )
    {
        $this->senderName = $senderName;
        $this->senderId = $senderId;
        $this->senderAvatar = $senderAvatar;
        $this->message = $message;
        $this->msgDate = $date;
    }

    public function broadcastOn()
    {
        return ['chat'];
    }

    public function broadcastAs()
    {
        return 'message';
    }
}