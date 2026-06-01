import {
  SendHorizontal,
} from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';
import { Input } from '@wraith/ui/shadcn/input';

export const ChatPanel = () => {
  return (
    <aside
      className="
        flex h-full w-[360px]
        shrink-0 flex-col
        border-l border-border
        bg-background
      "
    >
      <div
        className="
          border-b border-border
          px-5 py-4
        "
      >
        <h2
          className="
            text-base font-semibold
          "
        >
          Meeting Chat
        </h2>
      </div>

      <div
        className="
          flex-1 overflow-y-auto
          p-5
        "
      >
        <div
          className="
            flex h-full
            items-center justify-center
            text-sm
            text-muted-foreground
          "
        >
          No messages yet
        </div>
      </div>

      <div
        className="
          border-t border-border
          p-4
        "
      >
        <div
          className="
            flex items-center gap-3
          "
        >
          <Input
            placeholder="Send a message..."
            className="h-11"
          />

          <Button
            type="button"
            size="icon"
            className="
              h-11 w-11
              shrink-0
            "
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};