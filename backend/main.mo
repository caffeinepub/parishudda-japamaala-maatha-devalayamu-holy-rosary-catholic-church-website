import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Types
  type MassTiming = {
    day : Text;
    time : Text;
    serviceType : Text;
  };

  type SpiritualMessage = {
    title : Text;
    author : Text;
    fullText : Text;
    date : Int;
  };

  type Prayer = {
    title : Text;
    language : Text;
    content : Text;
  };

  type MediaItem = {
    mediaType : Text; // Image or YouTube
    url : Text;
    caption : Text;
  };

  type Announcement = {
    text : Text;
    eventDate : Int;
    active : Bool;
  };

  // Persistent Storage
  let massSchedule = List.empty<MassTiming>();
  let prayers = List.empty<Prayer>();
  let mediaGallery = List.empty<MediaItem>();
  var spiritualMessage : ?SpiritualMessage = null;
  var announcement : ?Announcement = null;

  // Mass Schedule with Default Data
  public shared ({ caller }) func addMassTiming(day : Text, time : Text, serviceType : Text) : async () {
    let newTiming = {
      day;
      time;
      serviceType;
    };
    massSchedule.add(newTiming);
  };

  public query ({ caller }) func getMassSchedule() : async [MassTiming] {
    massSchedule.toArray();
  };

  public query ({ caller }) func countMassSchedule() : async Nat {
    massSchedule.size();
  };

  // Spiritual Message
  public shared ({ caller }) func updateSpiritualMessage(title : Text, author : Text, fullText : Text) : async () {
    let newMessage = {
      title;
      author;
      fullText;
      date = Time.now();
    };
    spiritualMessage := ?newMessage;
  };

  public query ({ caller }) func getSpiritualMessage() : async ?SpiritualMessage {
    spiritualMessage;
  };

  // Prayer Module
  public shared ({ caller }) func addPrayer(title : Text, language : Text, content : Text) : async () {
    let newPrayer = {
      title;
      language;
      content;
    };
    prayers.add(newPrayer);
  };

  public query ({ caller }) func getPrayersByLanguage(language : Text) : async [Prayer] {
    prayers.filter(func(prayer) { prayer.language == language }).toArray();
  };

  public query ({ caller }) func filterPrayers(language : Text) : async [Prayer] {
    prayers.filter(func(p) { p.language == language }).toArray();
  };

  // Media Gallery
  public shared ({ caller }) func addMediaItem(mediaType : Text, url : Text, caption : Text) : async () {
    let newMedia = {
      mediaType;
      url;
      caption;
    };
    mediaGallery.add(newMedia);
  };

  public query ({ caller }) func getMediaGallery() : async [MediaItem] {
    mediaGallery.toArray();
  };

  // Announcements
  public shared ({ caller }) func updateAnnouncement(text : Text, eventDate : Int, active : Bool) : async () {
    let newAnnouncement = {
      text;
      eventDate;
      active;
    };
    announcement := ?newAnnouncement;
  };

  public query ({ caller }) func getAnnouncement() : async ?Announcement {
    announcement;
  };

  public query ({ caller }) func countPrayers() : async Nat {
    prayers.size();
  };

  public query ({ caller }) func countMediaGallery() : async Nat {
    mediaGallery.size();
  };
};
