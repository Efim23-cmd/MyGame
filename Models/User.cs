namespace MyGame.Models
{
    public class User
    {
        public uint Id { get; set; }
        public string UserName { get; set; }
        public uint Record { get; set; }

        public User(string UserName, uint Record)
        {
            this.UserName = UserName;
            this.Record = Record;
        }
    }
}
