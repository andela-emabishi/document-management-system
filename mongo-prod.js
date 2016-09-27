use dochero
// Now using 27017
// db.messages.dropIndex("title_text_content_text")
db.documents.createIndex({"title":"text","content":"text" })
exit
