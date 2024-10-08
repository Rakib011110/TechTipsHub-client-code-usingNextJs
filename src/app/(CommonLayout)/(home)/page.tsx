import Allpost from "@/src/components/home/@allposts/Allpost";
import CreatePost from "@/src/components/home/@createposts/page";
import NewsFeed from "@/src/app/(CommonLayout)/(home)/@newsfeed/page";

export default function Home() {
  return (
    <div>
      <CreatePost />
      {/* <Allpost /> */}
      <NewsFeed />
    </div>
  );
}
