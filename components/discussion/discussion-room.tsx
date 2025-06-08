import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useRef, useState } from "react";
import * as Icon from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { subscribeChats } from "@/lib/firebase/db/discussion";
import { User } from "@/lib/firebase/model/user";
import { Discussion, DiscussionChat } from "@/lib/firebase/model/discussion";
import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { useCreateDiscussionChat } from "@/lib/queries/discussion";

type DiscussionRoomProps = {
  user: User;
  users: User[];
  discussion: Discussion;
};

export function DiscussionRoom({
  user,
  users,
  discussion,
}: DiscussionRoomProps) {
  const { mutateAsync: createDiscussionChat } = useCreateDiscussionChat();

  const [chats, setChats] = useState<DiscussionChat[]>([]);
  const chatsContainer = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  useEffect(() => {
    function handleNewChats(
      snapshot: QuerySnapshot<DocumentData, DocumentData>
    ) {
      const newChats = [];

      for (const chatDoc of snapshot.docs) {
        const data = chatDoc.data();
        newChats.push({
          id: chatDoc.id,
          sender_id: data.sender_id,
          content: data.content,
          sent_at: data.sent_at,
        });
      }

      setChats(newChats);
    }

    return subscribeChats(user.class_id!, discussion.id, handleNewChats);
  }, [user.class_id, discussion.id]);

  useEffect(() => {
    if (chatsContainer.current) {
      chatsContainer.current.scrollTo({
        left: 0,
        top: chatsContainer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chats]);

  function getSender(senderId: string) {
    return users.find((user) => user.uid === senderId);
  }

  async function handleSubmitChat(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.currentTarget);
      formData.set("class_id", user.class_id!);
      formData.set("discussion_id", discussion.id);
      formData.set("sender_id", user.uid);

      await createDiscussionChat({
        class_id: user.class_id!,
        discussion_id: discussion.id,
        data: {
          sender_id: formData.get("sender_id") as string,
          content: formData.get("content") as string,
        },
      });

      /// @ts-expect-error reset maybe undefined
      e.target.reset?.();
      setStatus({ loading: false, success: true });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false });
    }
  }

  return (
    <section className="relative max-h-[calc(100vh-90px)]">
      <div
        className="p-6 grid gap-2 max-h-full overflow-y-auto pb-[90px]"
        ref={chatsContainer}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "flex sn",
              user.uid === chat.sender_id && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "max-w-[50%] flex gap-4",
                user.uid === chat.sender_id && "flex-row-reverse"
              )}
            >
              <figure className="bg-slate-400 p-2 rounded-full w-max h-max text-slate-600 mt-0.5">
                <Icon.User />
              </figure>
              <Card className="px-4 py-2 min-w-[150px]">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">
                    {getSender(chat.sender_id)?.name || "Anonymous"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p>{chat.content}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
      <footer className="absolute bottom-0 right-0 left-0 flex items-center h-[90px] px-6">
        <form
          className="flex items-center gap-4 w-full"
          onSubmit={handleSubmitChat}
        >
          <Input name="content" type="text" placeholder="Masukan pesan" />
          <Button size="icon" disabled={status.loading}>
            <Icon.Send />
          </Button>
        </form>
      </footer>
    </section>
  );
}
