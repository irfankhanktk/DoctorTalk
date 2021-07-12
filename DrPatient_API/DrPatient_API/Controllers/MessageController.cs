using System;
using System.Collections.Generic;
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
    public class MessageController : ApiController
    {
        private DoctorPatientEntities db = new DoctorPatientEntities();
        [HttpPost]
        public HttpResponseMessage UploadFile()
        {




            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count < 1)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            //to send extra form data with image
            var keys = httpRequest.Form;
            var NewMessage = new Message();
            NewMessage.From_ID = keys["From_ID"];
            NewMessage.To_ID = keys["To_ID"];
            NewMessage.Message_Content = keys["Message_Content"];
            NewMessage.Message_Type = keys["Message_Type"];
            NewMessage.Created_Time = keys["Created_Time"];
            NewMessage.Created_Date = Convert.ToDateTime(keys["Created_Date"]);
            NewMessage.Is_Seen = false;
          
            //foreach (var key in httpRequest.Form.AllKeys)
            //{
            //    var a = v[key];
            //    Console.WriteLine("key: ", a);
            //}


            var postedFile = httpRequest.Files[0];
            FileInfo fileInfo = new FileInfo(postedFile.FileName);
            var ext = fileInfo.Extension;
            string path = HttpContext.Current.Server.MapPath("~/MyFile/");
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string filePath = HttpContext.Current.Server.MapPath("~/MyFile/" + postedFile.FileName);
            try
            {
                postedFile.SaveAs(filePath);
                db.Messages.Add(NewMessage);
                db.SaveChanges();
            }
            catch (Exception exp)
            {
                Console.WriteLine(exp.ToString());
                throw;
            }

            return Request.CreateResponse(HttpStatusCode.OK, postedFile.FileName);
        }
        [HttpPost]
        public IHttpActionResult PostCCD(CCD ccd)
        {
           db.CCDs.Add(ccd);
            try
            {
                db.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }

            return Ok();
        }
        [HttpGet]
        public IHttpActionResult GetCCD(string Patient_ID)
        {

            var cCD = db.CCDs.Where(c=>c.Patient_ID==Patient_ID).FirstOrDefault();
            if (cCD == null)
            {
                return BadRequest();
            }
            return Ok(cCD);
        }
        [HttpGet]
        public IHttpActionResult GetMessage(int Message_ID)
        {
            Message message = db.Messages.Find(Message_ID);
            if (message == null)
            {
                return NotFound();
            }

            return Ok(message);
        }
        [HttpGet]
        public IHttpActionResult GetMessages(string To_ID,string From_ID)
        {
            try
            {
                var messages = db.Messages.Where(m => m.To_ID == To_ID&&m.From_ID==From_ID).ToList();
                return Ok(messages);
            }
            catch (Exception)
            {

                throw;
            }
           
        }
        [HttpGet]
        public IHttpActionResult DeleteMessages(string To_ID, string From_ID)
        {
            try
            {
                var messages = db.Messages.Where(m => m.To_ID == To_ID&& m.From_ID==From_ID).ToList();
                db.Messages.RemoveRange(messages);
                db.SaveChanges();
                return Ok(messages.Count());
            }
            catch (Exception)
            {

                throw;
            }

        }
        [HttpPost]
        public IHttpActionResult PostMessage(Message message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var m=db.Messages.Add(message);
            try
            {
                db.SaveChanges();

            }
            catch (Exception)
            {

                throw;
            }

            return Ok(m.Message_ID);
        }

        // DELETE: api/Message/5
        [ResponseType(typeof(Message))]
        public IHttpActionResult DeleteMessage(int id)
        {
            Message message = db.Messages.Find(id);
            if (message == null)
            {
                return NotFound();
            }

            db.Messages.Remove(message);
            db.SaveChanges();

            return Ok(message);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MessageExists(int id)
        {
            return db.Messages.Count(e => e.Message_ID == id) > 0;
        }
    }
}