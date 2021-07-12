using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using DrPatient_API.Models;

namespace DrPatient_API.Controllers
{
    public class UserController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();
        [HttpGet]

        public IHttpActionResult AlterDrRequest(string Phone,string Type)
        {
            var row=db.Users.Where(x=>x.Phone==Phone&&x.Role=="Doctor").FirstOrDefault();
            if (Type=="Confirm")
            {
                row.IsApproved = true;
                row.IsRejected = false;
            }
            else if(Type == "Cancel")
            {
                row.IsApproved = false;
                row.IsRejected = true;
            }
            else if(Type == "Reject")
            {
                row.IsApproved = true;
                row.IsRejected = true;
            }
            try
            {
                db.Entry(row).State = EntityState.Modified;
                db.SaveChanges();
                return Ok(row);
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        public IHttpActionResult GetRejectedDoctors()
        {
           
            try
            {
                var rows = db.Users.Where(u => u.IsRejected == true && u.Role=="Doctor").ToList();
                return Ok(rows);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public HttpResponseMessage UploadFile(string  Phone)
        {
            var row = db.Users.Where(x=>x.Phone==Phone).FirstOrDefault();
            if (row == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            var httpRequest = HttpContext.Current.Request;
            //to send extra form data with image
            //var v=httpRequest.Form;
            //foreach (var key in httpRequest.Form.AllKeys)
            //{
            //    var a = v[key];
            //    Console.WriteLine("key: ", a);
            //}
            if (httpRequest.Files.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            var postedFile = httpRequest.Files[0];
            FileInfo fileInfo = new FileInfo(postedFile.FileName);
            var ext = fileInfo.Extension;
            string path=HttpContext.Current.Server.MapPath("~/Images/");
            if (Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string filePath = HttpContext.Current.Server.MapPath("~/Images/" + postedFile.FileName);
            postedFile.SaveAs(filePath);

           //to save in db
            row.Image = postedFile.FileName;
            db.Entry(row).State = EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }

            return Request.CreateResponse(HttpStatusCode.OK, postedFile.FileName);
        }
        //[HttpPost]
        //    public IHttpActionResult PostImage()
        //    {
        //        //var file = Request.Files[0];
        //        //string namefile = string.Empty;
        //        //namefile = System.IO.Path.GetFileNameWithoutExtension(file.FileName);
        //        //if (!string.IsNullOrEmpty(namefile))
        //        //{
        //        //    namefile = System.Text.RegularExpressions.Regex.Replace(namefile, "[^a-zA-Z0-9 -_]", "");
        //        //    _fileName = namefile + "_" + DateTime.Now.ToString("mmss") + System.IO.Path.GetExtension(file.FileName);
        //        //    var path = System.IO.Path.Combine(Server.MapPath("~/CompanyImages/" + Session["CompanyCode"].ToString() + "/Member/"), _fileName);
        //        //    file.SaveAs(path);
        //        //}
        //        //Use Namespace called :  System.IO  
        //        //string FileName = Path.GetFileNameWithoutExtension(user.ImageFile.FileName);

        //        ////To Get File Extension  
        //        //string FileExtension = Path.GetExtension(user.ImageFile.FileName);

        //        ////Add Current Date To Attached File Name  
        //        //FileName = DateTime.Now.ToString("yyyyMMdd") + "-" + FileName.Trim() + FileExtension;

        //        ////Get Upload path from Web.Config file AppSettings.  
        //        //string UploadPath = ConfigurationManager.AppSettings["UserImagePath"].ToString();
        //        ////    var path = System.IO.Path.Combine(Server.MapPath("~/CompanyImages/" + Session["CompanyCode"].ToString() + "/Member/"), _fileName);

        //        ////Its Create complete path to store in server.  
        //        //user.Image = UploadPath + FileName;
        //        ////To copy and save file into server.  
        //        //user.ImageFile.SaveAs(user.Image);
        //        return Ok();
        //    }
        [HttpGet]
        public IHttpActionResult GetetApprovedDoctors()
        {
            try
            {
                var rows = db.Users.Where(u => u.IsApproved == true && u.IsRejected == false && u.Role == "Doctor").ToList();
                return Ok(rows);
            }
            catch (Exception)
            {

                throw;
            }
           
        }
        [HttpGet]
        public IHttpActionResult GetUnApprovedDoctors()
        {
            try
            {
                var rows = db.Users.Where(u => u.IsApproved == false && u.IsRejected == false && u.Role == "Doctor").ToList();
                return Ok(rows);
            }
            catch (Exception)
            {

                throw;
            }
           
        }
        private bool IsAlreadyFriend(string From_ID, string To_ID)
        {
            return db.Friends.Count(f => (f.From_ID == From_ID && f.To_ID == To_ID)||(f.From_ID == To_ID && f.To_ID == From_ID))>0;
        }
        public bool SendFriendRequest(string From_ID, string To_ID)
        {
            var row = db.Friends.Where(f => f.From_ID == From_ID && f.To_ID == To_ID).FirstOrDefault();
            var friend = new Friend();

            if (row == null)
            {
                friend.From_ID = From_ID;
                friend.To_ID = To_ID;
                friend.Friend_Type = "Requested";
                row = db.Friends.Add(friend);
            }
            else
            {
                if (row.Friend_Type == null)
                {
                    row.Friend_Type = "Requested";

                }
                else
                {
                    return true;

                }
                db.Entry(row).State = EntityState.Modified;
            }
            //if (row != null)
            try
            {
                db.SaveChanges();

            }
            catch (Exception)
            {

                return false;
            }
            return true;
        }
        [HttpGet]
        public IHttpActionResult Invite(string From_ID, string To_ID)
        {
            if (IsAlreadyFriend(From_ID, To_ID))
            {
                return Ok("Already Friend");
            }
            var user = db.Database.SqlQuery<User>("select * from [User] where Phone="+To_ID).FirstOrDefault();
            if (user!=null)
            {
                return Ok("Already User");
            }
            var row = db.Invitations.Where(x=>x.From_ID==From_ID&&x.To_ID==To_ID).FirstOrDefault();
            if (row != null)
            {
                return Ok("Already Invited");
            }
            else
            {
                int code = new Random().Next(10000);
                Invitation invitation = new Invitation();
                invitation.From_ID = From_ID;
                invitation.To_ID = To_ID;
                invitation.Invitation_Type = "Requested";
                invitation.Invitation_Code = code;
                db.Invitations.Add(invitation);
                db.SaveChanges();
                return Ok("Invited Successfully");
            }
          
        }
        [HttpGet]
        public IHttpActionResult InvitationCode(string Phone,int code, string name)
        {
            var row = db.Invitations.Where(x=>x.To_ID== Phone&&x.Invitation_Code==code&&x.Invitation_Type=="Requested").FirstOrDefault();
            if (row == null)
            {
                return BadRequest();
            }

            row.Invitation_Type = "Accepted";
            db.Entry(row).State = EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
            User user = new User();
            user.Phone = Phone;
            user.Name = name;
            user.Role = "Patient";
            var u = db.Users.Add(user);

            try
            {
                db.SaveChanges();
                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex + "");
            }
        }
        [HttpGet]
        public IHttpActionResult IsUser(string Phone)
        {
            //var isExist = db.Users.Count(x => x.To_ID == Phone && x.IsApproved==false) > 0;
            //if (isExist)
            //{
            //    return Ok("Not Approved");
            //}
            var row = db.Users.Where(u=>u.Phone==Phone).FirstOrDefault();
            if (row != null)
            {
                if (row.IsApproved == false && row.IsRejected==true && row.Role=="Doctor")
                {
                    return Ok("Not Approved");
                }
                else if (row.IsApproved == true && row.IsRejected == true && row.Role == "Doctor")
                {
                    return Ok("Block");
                }
                return Ok(row);
            }
            return NotFound();
        }
        public IHttpActionResult GetUsers(string Phone)
        {
            var friends=db.Friends.Where(f=>(f.From_ID==Phone||f.To_ID==Phone)&&f.Friend_Type=="Accepted");
            List<string> vs = new List<string>();
            foreach (var item in friends)
            {
                var row =(UserFriendView) db.Users.Where(u => u.Phone != Phone && (u.Phone == item.To_ID || u.Phone == item.From_ID)).FirstOrDefault();
                if (item.To_ID == Phone)
                {
                    //row.IsBlock_ByMe = item.IsBlock_To;
                    //row.IsArchive = item.IsArchive_To;

                    vs.Add(item.From_ID);
                }
                else
                {
                    //row.IsBlock_ByFriend = item.IsBlock_From;
                    //row.IsArchive = item.IsArchive_From;

                    vs.Add(item.To_ID);
                }
                row.Friend_Type = item.Friend_Type;

            }
            var ufv2 = new List<UserFriendView>();
            var ulist = db.Users.Where(u => u.Phone != Phone && !vs.Contains(u.Phone)&&u.Role!="Admin").ToList();
            foreach (var item in ulist)
            {
                var row = (UserFriendView)item;
                var requestFriend = db.Friends.Where(x=>x.From_ID==Phone && x.Friend_Type=="Requested" && x.To_ID==item.Phone).FirstOrDefault();
                if (requestFriend==null)
                {
                    row.Friend_Type = null;
                }
                else
                {
                    row.Friend_Type = requestFriend.Friend_Type;
                }
                ufv2.Add(row);
            }
  
            return Ok(ufv2);
        }

        // GET: api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(string id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/User/5
        [HttpGet]
        public IHttpActionResult UpdateName(string Phone,string Name)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var u = db.Users.Where(x=>x.Phone==Phone).FirstOrDefault();
            if (u==null)
            {
                return NotFound();
            }
            u.Name = Name;
            db.Entry(u).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
               
                    throw;
         
            }

            return Ok(u);
        }

        // POST: api/User
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var isExist = db.Users.Count(x=>x.Phone==user.Phone)>0;
            if (isExist)
            {
                return Ok("Already Account");
            }
            var u=db.Users.Add(user);

            try
            {
                db.SaveChanges();
                return Ok(u);
            }
            catch (Exception ex)
            {
              return  BadRequest(ex+"");
            }

        }

        // DELETE: api/User/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(string id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(string id)
        {
            return db.Users.Count(e => e.Phone == id) > 0;
        }
    }
}