<?php
defined('_JEXEC') or die('Restricted access');
JTable::addIncludePath(DS . 'components/com_jbusinessdirectory/tables');

class JBusinessDirectoryModelApi extends JModelLegacy
{
    function __construct()
    {
        parent::__construct();
    }

	public function getTable($type = 'OfferPictures', $prefix = 'JTable', $config = array())
	{
		return JTable::getInstance($type, $prefix, $config);
	}

    protected function populateState($ordering = null, $direction = null)
    {
        $app = JFactory::getApplication('administrator');
	}

	/*function testResize(){
		require_once JPATH_COMPONENT_SITE.DS.'include'.DS.'base64image.php'; 
		$base64_string=getBase64CoreString();
		$output_file = time().'.jpg';
		$offer_pictures_path = $this->base64_to_jpeg($base64_string, $output_file, 5555);
				
		$pictures_folder = JBusinessUtil::makePathFile(JPATH_ROOT."/".PICTURES_PATH."/offers/");
		$thumbs_folder = JBusinessUtil::makePathFile(JPATH_ROOT."/".PICTURES_PATH."/offers/thumbs/");
		$picture_path = JBusinessUtil::makePathFile(JPATH_ROOT."/".PICTURES_PATH."/offers/1534117170.jpg");		
		echo '<br>';
		echo $picture_path;
		echo '<br>';
		echo '<img src="'.$picture_path.'">';
		echo 'fabio'; die();
	}*/
	
	function Offer($resource){
		
		switch($resource){
            case  'saveOffer' :
            $this->saveOffer();
			break;
            case  'deleteOffer' :
            $this->deleteOffer();
			break;			
            case  'setOfferState' :
            $this->setOfferState();
			break;
            default: die();
            break;
        }
        return true;
	}

    function Offers($resource)
    {
        $app = JFactory::getApplication();
		$jinput = $app->input;
        $view = $jinput->get( 'view', null);
        switch($resource){
            case  'getOffers' :
            $this->getOffers();
			break;
            default: die();
            break;
        }
        return true;
	}
	function Categories($resource)
    {
        $app = JFactory::getApplication();
		$jinput = $app->input;
        $view = $jinput->get( 'view', null);
        switch($resource){
            case  'getCategories' :
            $this->getCategories();
			break;
			case 'getOffersCategory':
            $this->getOffersCategory();
			break;
            default: echo 'Categories';die();
            break;
        }
        return true;
	}
	function Company($resource)
    {
        $app = JFactory::getApplication();
		$jinput = $app->input;
        $view = $jinput->get( 'view', null);
        switch($resource){
            case  'update' :
            $this->updateCompany();
			break;				
			case  'getCompanyOffers' :
            $this->getCompanyOffers();
			break;		
            default: echo 'Categories';die();
            break;
        }
        return true;
	}
	function User($resource)
    {
        $app = JFactory::getApplication();
		$jinput = $app->input;
        $view = $jinput->get( 'view', null);
        switch($resource){
            case  'signup' :
            $this->signupUser();
			break;					
			case  'getUserOffers' :
            $this->getUserOffers();
			break;			
            default: echo 'User';die();
            break;
        }
        return true;
	}
	function Localities($resource)
    {
        $app = JFactory::getApplication();
		$jinput = $app->input;
        $view = $jinput->get( 'view', null);
        switch($resource){
            case  'getLocalities' :
            $this->getLocalities();
			break;
			case 'getOffersLocality':
            $this->getOffersLocality();
			break;
            default: echo 'Localities';die();
            break;
        }
        return true;
	}

	function deleteOffer(){
		$app = JFactory::getApplication();
		$jinput = $app->input;
		$json = $jinput->json->getRaw();
		$userData = json_decode($json, true);
		$post['id'] = $userData['id'];
		$post['state'] = 0;
		$offerId =	$this->storeOffer($post);
		$devolver['error'] = '';
		$devolver['post'] = $post;
		echo json_encode($devolver);
		die();
	}
	
	function setOfferState(){
		$app = JFactory::getApplication();
		$jinput = $app->input;
		$json = $jinput->json->getRaw();
		$userData = json_decode($json, true);
		$post['id'] = $userData['id'];
		$post['state'] = $userData['state'];
		$offerId =	$this->storeOffer($post);
		$devolver['error'] = '';
		$devolver['post'] = $post;
		echo json_encode($devolver);
		die();
	}

	function saveOffer(){

		$app = JFactory::getApplication();
		$jinput = $app->input;
		$json = $jinput->json->getRaw();
		$userData = json_decode($json, true);
		
		$image=$userData['image'];
		$offerId=$userData['offer_id'];		

		$isNew = false;
		if($offerId==0){
			$isNew=true;
		}

		$post['user_id'] = $userData['user_id'];
		$post['offer_id'] = $userData['offer_id'];
		$post['id'] = $userData['offer_id'];
		$post['subject'] = $userData['subject'];
		$post['description'] = $userData['description'];
		$post['short_description'] = $userData['description'];
		$post['price'] = $userData['price'];
		$post['specialPrice'] = $userData['specialPrice'];
		$post['companyId'] = $userData['companyId'];
		$post['main_subcategory'] = $userData['categories'][0];
		$post['categories'] = $userData['categories'];
		
		$post['state'] = $userData['state'];
		$post['currencyId'] = 8;
		
		$publish_start_date = date("Y-m-d",mktime(0, 0, 0, date("m")  , date("d")-1, date("Y")));
		$publish_end_date = date("Y-m-d",mktime(0, 0, 0, date("m")+2  , date("d"), date("Y")));

		$post["startDate"] = JBusinessUtil::convertToMysqlFormat($publish_start_date);
		$post["endDate"] = JBusinessUtil::convertToMysqlFormat($publish_end_date);
		$post["publish_start_date"] = JBusinessUtil::convertToMysqlFormat($publish_start_date);
		$post["publish_end_date"] = JBusinessUtil::convertToMysqlFormat($publish_end_date);

		$post["publish_start_time"] = JBusinessUtil::convertTimeToMysqlFormat('00:00:00');
		$post["publish_end_time"] = JBusinessUtil::convertTimeToMysqlFormat('00:00:00');
        if (!empty($post["price"]))
            $post["price"] = JBusinessUtil::convertPriceToMysql($post["price"]);
        if (!empty($post["specialPrice"]))
            $post["specialPrice"] = JBusinessUtil::convertPriceToMysql($post["specialPrice"]);

		$post['approved'] = 1;

		$company = $this->getCompanyByUserId($userData['user_id']);
		$post['address'] = $company->address;
		$post['street_number'] = $company->street_number;
		$post['city'] = $company->city;
		$post['county'] = $company->county;
		$post['province'] = $company->province;
		$post['countryId'] = $company->countryId;
		$post['latitude'] = $company->latitude;
		$post['longitude'] = $company->longitude;
		
//echo json_encode($post);die();

		$offerId =	$this->storeOffer($post);

		/*$modelOffer = $this->getInstance('offer', 'JBusinessDirectoryModel');
	
		if (!$modelOffer->save($post)){
			$post['error'] = 'error guardando';
			echo json_encode($post);
			die();
		}*/
		if(isset($userData['image']) && $userData['image']!=''){		
		$base64_string=$userData['image'];
		$output_file = time().'.jpg';		
		$offer_pictures_path = $this->base64_to_jpeg($base64_string, $output_file, $offerId);
		$picture_path = JBusinessUtil::makePathFile(OFFER_PICTURES_PATH.($offerId)."/".$output_file);
		$datapictures['pictures'][0]['picture_info'] = '';
		$datapictures['pictures'][0]['picture_path'] = $picture_path;
		$datapictures['pictures'][0]['picture_enable'] = 1;
		$this->storePictures($datapictures, $offerId, $oldId);
		}


		if($post['offer_id']>0){
			//se envió editar

		}else{
			//se envio nueva oferta
			if($offerId>0){
				$post['offer_id'] = $offerId;
			}
		}
		$post['picture_path'] = $picture_path;
		$devolver['error'] = '';
		$devolver['post'] = $post;
		

		echo json_encode($devolver);
		die();
		
		/*$query = "SELECT * from #__users WHERE email = '$email'";
			$db =JFactory::getDBO();
			$db->setQuery( $query );
			if (!$db->query())
			{
				throw( new Exception($db->getErrorMsg()) );
			}
			$userExists = $db->loadObject();*/
	}

	function signupUser(){
		$secretKey = 'fabio';
		$app = JFactory::getApplication();
		$jinput = $app->input;
		$json = $jinput->json->getRaw();
		$post = json_decode($json, true);				
		$email=$post['email'];		
		$email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email); 
		$error = null;
		
        if (strlen(trim($email))>0 && $email_check>0)
        {
			$key=md5($secretKey.$email);
			$token = hash('sha256', $key);			
			$query = "SELECT * from #__users WHERE email = '$email'";
			$db =JFactory::getDBO();
			$db->setQuery( $query );
			if (!$db->query())
			{
				throw( new Exception($db->getErrorMsg()) );
			}
			$userExists = $db->loadObject();	
			
			if(isset($userExists) && $userExists->id){
				$userData = $userExists;
			}else{
				$newUser = $this->registerNewUser($post);
				if(!$newUser['error']){
					$newUser['userData']->token = $token;
					$userData = $newUser['userData'];
				}else{
					$error = $newUser['error'];
				}				
				//echo json_encode($userData);die();
			}
			//print_r($userData);die();
			$company = $this->getCompanyByUserId($userData->id);
			//print_r($company);die();
		}
		// mandar solo datos necesarios
		$userDataSend = new JObject();
		$userDataSend->id = $userData->id;
		$userDataSend->name = $userData->name;
		$userDataSend->email = $userData->email;

		$userDataSend->facebook_id=$post['facebook_id'];
		$userDataSend->google_id=$post['google_id'];
		$userDataSend->first_name=$post['first_name'];
		$userDataSend->last_name=$post['last_name'];
		$userDataSend->picture=$post['picture'];
		
		if(isset($company) && $company->id){
			$userDataSend->company_id = $company->id;
			$userDataSend->company_name = $company->name;
			$userDataSend->company_whatsapp = $company->whatsapp;
			$userDataSend->company_address = $company->address;
			$userDataSend->company_street_number = $company->street_number;
			$userDataSend->company_city = $company->city;
			$userDataSend->company_county = $company->county;
			$userDataSend->company_province = $company->province;
			$userDataSend->company_latitude = $company->latitude;
			$userDataSend->company_longitude = $company->longitude;
		}
		$returnUserData['error'] = $error;
		$returnUserData['userData'] = $userDataSend;
		echo json_encode($returnUserData);
        die();
	}

	function registerNewUser($userData){
		$error = null;		
		jimport('joomla.user.helper');
		$data = array(
			"name"=>$userData['first_name'],
			"username"=>$userData['email'],
			"password"=>$userData['email'],
			"password2"=>$userData['email'],
			"email"=>$userData['email'],
			"block"=>0,
			"groups"=>array("1","2")
		);
		$user = new JUser;
		if(!$user->bind($data)) {
			$error[] = "Could not bind data. Error: " . $user->getError();
		}
		if (!$user->save()) {
			$error[] = "Could not save data. Error: " . $user->getError();
		}
		
		$retornar['error'] = $error;
		$retornar['userData'] = $user;
		return $retornar;	
	}

	function getUserByEmail($email){
			$query = "SELECT * from #__users WHERE email = '$email'";
			$db =JFactory::getDBO();
			$db->setQuery( $query );
			$userExists = $db->loadObject();				
			if(!$userExists->id){
				return null;
			}else{
				return $userExists;
			}
	}

	function getCompanyByUserId($userId){
		$db =JFactory::getDBO();		
		$query = "select * from #__jbusinessdirectory_companies where userId = '$userId' ";
		$db->setQuery($query);
		return $db->loadObject();
	}



	function updateCompany(){
		$app = JFactory::getApplication();
		$jinput = $app->input;		
		$json = $jinput->json->getRaw();
		$companyData = json_decode($json);
		$error = '';
		$companyDataProcesed = null;
		//$token = str_replace('Bearer ',($_SERVER['HTTP_AUTHORIZATION']));
		//$userData = $this->getUserByToken($token);
		$email = $companyData->email;
		$name = $companyData->name;
		$whatsapp = $companyData->whatsapp;
		$address = $companyData->address ;
		$street_number = $companyData->street_number ;
		$city = $companyData->city ;
		$county = $companyData->county ;
		$countryId = 11 ;
		$province = $companyData->province ;
		$latitude = $companyData->latitude ;
		$longitude = $companyData->longitude ;
		
		$userData = $this->getUserByEmail($email);
		//print_r($userData);
        $modelCompanies = $this->getInstance('companies', 'JBusinessDirectoryModel');

		
		
		if($userData->id){
			$post['userId'] = $userData->id ;
			$post['name'] = $name ;
			$post['whatsapp'] = $whatsapp ;
			$post['address'] = $companyData->address ;
			$post['street_number'] = $companyData->street_number ;
			$post['city'] = $companyData->city ;
			$post['county'] = $companyData->county ;
			$post['countryId'] = 11 ;
			$post['province'] = $companyData->province ;
			$post['latitude'] = $companyData->latitude ;
			$post['longitude'] = $companyData->longitude ;

			$company = $this->getCompanyByUserId($userData->id);
			if(isset($company) && $company->id){
				$db =JFactory::getDBO();
				$companyId = $db->escape($company->id);
				$query = 	" UPDATE #__jbusinessdirectory_companies SET name = '$name', whatsapp = '$whatsapp', address = '$address', street_number = '$street_number', city = '$city', county = '$county', province = '$province', countryId = '$countryId', latitude = '$latitude', longitude = '$longitude' WHERE id = ".$companyId ;
				//echo json_encode($query, JSON_UNESCAPED_UNICODE);die();
				$db->setQuery( $query );
				if (!$db->query())
					{
						throw( new Exception($db->getErrorMsg()) );
						$error = $db->getErrorMsg();
					}
				$post['id'] = $companyId ;
				$companyDataProcesed = $post;				
			}else{

				
				
				$modelCompany = $this->getInstance('managecompany', 'JBusinessDirectoryModel');
				$post["task"] = '';
				$post["description"] = '';
				$post["custom_tab_content"] = '';
				$post["selectedMemberships"] = '';
				$post["pictures"][0]['picture_path'] = '';
				$post["pictures"][0]['picture_info'] = '';
				$post["pictures"][0]['picture_enable'] = '';
				$post["identifier"] = '';
				$post["contact_name"][0] = $userData->name;
				$post["contact_email"][0] = $userData->email;
				$post["contact_phone"][0] = $whatsapp;
				$post["contact_fax"][0] = '1';
				$post["contact_department"][0] = '1';
				$post["contact_id"][0] = '1';
				$post["testimonial_title"][0] = '';
				$post["testimonial_name"][0] = '';
				$post["testimonial_description"][0] = '';
				$post["testimonial_id"][0] = '';
				$post["work_start_hour"][0] = 'hour';
				$post["work_end_hour"][0] = 'hour';
				$post["work_ids"][0] = '';
				$post["work_status"][0] = '';
				$post["supplied"] = '';
				$post["break_start_hour"] = [];
				$post["break_end_hour"] = [];
				$post["break_ids"] = [];
				$post["breaks_count"] = [];
				$post["publish_start_date"] = '';
				$post['companyTypes'][0] = 1;
				$post['selectedSubcategories'][0] = 12;
				$post['mainSubcategory'] = 12;
				$post['typeId'][0] = 1;
				
				$post['approved'] = 2;
				$post['filter_package'] = 5;
				$post['phone'] = $whatsapp;	
				$newCompanyId = $modelCompany->save($post);
				$post['id'] = $newCompanyId;	
				if (!$newCompanyId){
					$error = 'error al guardar la compañia'; 
					$companyDataProcesed = null;	
				}else{
					$companyDataProcesed = $post;	
				}
							
			}
		}else{
			$error[] = 'error al obtener el usuario';
		}
		
		$retornar['error'] = $error;
		$retornar['companyData'] = $companyDataProcesed;
		echo json_encode($retornar, JSON_UNESCAPED_UNICODE);
        die();
	}

	
	function getOffersCategory()
	{
		//$document = JFactory::getDocument();		
		//$app = JFactory::getApplication();
		//$jinput = $app->input;
		//$category_id = $jinput->get( 'id', null);		
        $modelOffers = $this->getInstance('offers', 'JBusinessDirectoryModel');
		$offers = $modelOffers->getOffers();
		for ($i=0; $i < count($offers); $i++) { 
			$offer = $offers[$i];
			$address = JBusinessUtil::getAddressText($offers[$i]);
			$offers[$i]->full_address = $address;
			if (!JBusinessUtil::emptyDate($offer->startDate) || !JBusinessUtil::emptyDate($offer->endDate)) {				
				$start_to_end_date = JBusinessUtil::getDateGeneralShortFormat($offer->startDate) . " - " . JBusinessUtil::getDateGeneralShortFormat($offer->endDate);
				$offers[$i]->start_to_end_date = $start_to_end_date;
			}
			if(!empty($offer->show_time) && $this->getRemainingtime($offer->endDate)!=""){
				$remaining_time = $this->getRemainingtime($offer->endDate);
				$offers[$i]->remaining_time = $remaining_time;
			}
			if (!empty($offer->price)) {
				$offers[$i]->priceFormated = JBusinessUtil::getPriceFormat($offer->price, $offer->currencyId);
			}
			if (!empty($offer->specialPrice)) { 
				$offers[$i]->specialPriceFormated = JBusinessUtil::getPriceFormat($offer->specialPrice, $offer->currencyId); 
			}
			if (!empty($offer->specialPrice) && !empty($offer->price) && $offer->specialPrice < $offer->price) {
				$offers[$i]->priceDiscount = JBusinessUtil::getPriceDiscount($offer->specialPrice, $offer->price);
			}
		}		
		//echo '<pre>'; print_r($offers); die();	
		echo json_encode($offers, JSON_UNESCAPED_UNICODE);
        die();
	}


	
	function getCategories(){		
		$categoriesTable = $this->getTable('Category', 'JBusinessTable');
		$categoriesList = $categoriesTable->getAllCategories(2);	
		//echo '<pre>'; print_r($categoriesList); die();	
		echo json_encode($categoriesList, JSON_UNESCAPED_UNICODE);
        die();		
	}

	function getLocalities(){		
		$cityTable = $this->getTable('City', 'JTable');
		$citieList = $cityTable->getCities();	
		//echo '<pre>'; print_r($categoriesList); die();	
		echo json_encode($citieList, JSON_UNESCAPED_UNICODE);
        die();		
	}

	
	function getUserOffers()
	{
		$document = JFactory::getDocument();
		$app = JFactory::getApplication();
		$jinput = $app->input;
        $id = $jinput->get( 'id', null);
//$id=706;	
		$offersTable = $this->getTable("Offer");		
		
		$offers = $offersTable->getUserOffers($id, $this->getCompaniesByUserId(), 0, 1000);			
		
        //$modelOffers = $this->getInstance('offers', 'JBusinessDirectoryModel');
		//$offers = $modelOffers->getOffers();
//echo '<pre>';print_r($offers);die();
$sendOffers = [];
		for ($i=0; $i < count($offers); $i++) { 
			$offer = $offers[$i];
			$address = JBusinessUtil::getAddressText($offers[$i]);
			$offers[$i]->full_address = $address;
			if (!JBusinessUtil::emptyDate($offer->startDate) || !JBusinessUtil::emptyDate($offer->endDate)) {				
				$start_to_end_date = JBusinessUtil::getDateGeneralShortFormat($offer->startDate) . " - " . JBusinessUtil::getDateGeneralShortFormat($offer->endDate);
				$offers[$i]->start_to_end_date = $start_to_end_date;
			}
			if(!empty($offer->show_time) && $this->getRemainingtime($offer->endDate)!=""){
				$remaining_time = $this->getRemainingtime($offer->endDate);
				$offers[$i]->remaining_time = $remaining_time;
			}
			if (!empty($offer->price)) {
				//$offers[$i]->priceFormated = JBusinessUtil::getPriceFormat($offer->price, $offer->currencyId);
				$offers[$i]->priceFormated = "$".number_format($offer->price , 0 ,',','.');
			}
			if (!empty($offer->specialPrice)) { 
				//$offers[$i]->specialPriceFormated = JBusinessUtil::getPriceFormat($offer->specialPrice, $offer->currencyId); 
				$offers[$i]->specialPriceFormated = "$".number_format($offer->specialPrice , 0 ,',','.');
			}
			if (!empty($offer->specialPrice) && !empty($offer->price) && $offer->specialPrice < $offer->price) {
				$offers[$i]->priceDiscount = JBusinessUtil::getPriceDiscount($offer->specialPrice, $offer->price);
			}
			$categoriesOfOffer = $this->getCategoriesOfOffer($offer->id);
			foreach ($categoriesOfOffer as $key => $value) {
				$offers[$i]->categories[]=$value->categoryId;
			}
			if($offer->state!=0){
				//unset($offers[$i]);
				$sendOffers[]=$offers[$i];
			}
		}
		if(count($offers)==1){

		}

		//print_r($sendOffers);

		echo json_encode($sendOffers, JSON_UNESCAPED_UNICODE);
        die();
	}

	public function getCategoriesOfOffer($offerId){
		$db =JFactory::getDBO();
		$query = "select oc.categoryId from #__jbusinessdirectory_company_offer_category as oc 
		left join #__jbusinessdirectory_categories as c on c.id = oc.categoryId 
		where oc.offerId = $offerId order by c.name ";
		//echo $query ;die();
		$db->setQuery($query);		
		return $db->loadObjectList();
	}


	function getCompanyOffers()
	{
		$document = JFactory::getDocument();
		$app = JFactory::getApplication();
		$jinput = $app->input;
        $id = $jinput->get( 'id', null);		
		

		$offersTable = $this->getTable("Offer");		
		
		$offers = $offersTable->getUserOffers($id, $this->getCompaniesByUserId(), 0, 1000);			
			
		echo json_encode($offers, JSON_UNESCAPED_UNICODE);
		die();

        $modelOffers = $this->getInstance('offers', 'JBusinessDirectoryModel');
		$offers = $modelOffers->getOffers();
//echo '<pre>';print_r($offers);die();
		for ($i=0; $i < count($offers); $i++) { 
			$offer = $offers[$i];
			$address = JBusinessUtil::getAddressText($offers[$i]);
			$offers[$i]->full_address = $address;
			if (!JBusinessUtil::emptyDate($offer->startDate) || !JBusinessUtil::emptyDate($offer->endDate)) {				
				$start_to_end_date = JBusinessUtil::getDateGeneralShortFormat($offer->startDate) . " - " . JBusinessUtil::getDateGeneralShortFormat($offer->endDate);
				$offers[$i]->start_to_end_date = $start_to_end_date;
			}
			if(!empty($offer->show_time) && $this->getRemainingtime($offer->endDate)!=""){
				$remaining_time = $this->getRemainingtime($offer->endDate);
				$offers[$i]->remaining_time = $remaining_time;
			}
			if (!empty($offer->price)) {
				//$offers[$i]->priceFormated = JBusinessUtil::getPriceFormat($offer->price, $offer->currencyId);
				$offers[$i]->priceFormated = "$".number_format($offer->price , 0 ,',','.');
			}
			if (!empty($offer->specialPrice)) { 
				//$offers[$i]->specialPriceFormated = JBusinessUtil::getPriceFormat($offer->specialPrice, $offer->currencyId); 
				$offers[$i]->specialPriceFormated = "$".number_format($offer->specialPrice , 0 ,',','.');
			}
			if (!empty($offer->specialPrice) && !empty($offer->price) && $offer->specialPrice < $offer->price) {
				$offers[$i]->priceDiscount = JBusinessUtil::getPriceDiscount($offer->specialPrice, $offer->price);
			}
		}		
		echo json_encode($offers, JSON_UNESCAPED_UNICODE);
        die();
	}
	
	function getCompaniesByUserId(){
		$user = JFactory::getUser();
		$companiesTable = $this->getTable("Company");
		$companies =  $companiesTable->getCompaniesByUserId($user->id);
		$result = array();
		foreach($companies as $company){
			$result[] = $company->id;
		}
		return $result;
	}


    function getOffers()
	{
		$document = JFactory::getDocument();		
		
        $modelOffers = $this->getInstance('offers', 'JBusinessDirectoryModel');
		$offers = $modelOffers->getOffers();
//echo '<pre>';print_r($offers);die();
		for ($i=0; $i < count($offers); $i++) { 
			$offer = $offers[$i];
			$address = JBusinessUtil::getAddressText($offers[$i]);
			$offers[$i]->full_address = $address;
			if (!JBusinessUtil::emptyDate($offer->startDate) || !JBusinessUtil::emptyDate($offer->endDate)) {				
				$start_to_end_date = JBusinessUtil::getDateGeneralShortFormat($offer->startDate) . " - " . JBusinessUtil::getDateGeneralShortFormat($offer->endDate);
				$offers[$i]->start_to_end_date = $start_to_end_date;
			}
			if(!empty($offer->show_time) && $this->getRemainingtime($offer->endDate)!=""){
				$remaining_time = $this->getRemainingtime($offer->endDate);
				$offers[$i]->remaining_time = $remaining_time;
			}
			if (!empty($offer->price)) {
				//$offers[$i]->priceFormated = JBusinessUtil::getPriceFormat($offer->price, $offer->currencyId);
				$offers[$i]->priceFormated = "$".number_format($offer->price , 0 ,',','.');
			}
			if (!empty($offer->specialPrice)) { 
				//$offers[$i]->specialPriceFormated = JBusinessUtil::getPriceFormat($offer->specialPrice, $offer->currencyId); 
				$offers[$i]->specialPriceFormated = "$".number_format($offer->specialPrice , 0 ,',','.');
			}
			if (!empty($offer->specialPrice) && !empty($offer->price) && $offer->specialPrice < $offer->price) {
				$offers[$i]->priceDiscount = JBusinessUtil::getPriceDiscount($offer->specialPrice, $offer->price);
			}			
		}		
		echo json_encode($offers, JSON_UNESCAPED_UNICODE);
        die();
	}

	/*
	select oc.*, c.* from mx6p9_jbusinessdirectory_company_offer_category as oc 
		left join mx6p9_jbusinessdirectory_categories as c on c.id = oc.categoryId 
		where c.published=1 and oc.offerId = 3 order by c.name
		*/
	
	

    function getRemainingTime($date){
		$now = new DateTime();
		$future_date = new DateTime($date);
		$timestamp = strtotime($date);
		$timestamp = strtotime('+1 day', $timestamp);
		if($timestamp  < time()){
			return "";
		}
		
		$interval = $future_date->diff($now);
		$result = JText::_("LNG_ENDS_IN");
		
		if($interval->format("%a")){
			$result .= " ".$interval->format("%a")." ".(JText::_("LNG_DAYS"));
		}
		
		if($interval->format("%h")){
			$result .= " ".$interval->format("%h")." ".(JText::_("LNG_HOURS"));
		}
		
		if($interval->format("%m")){
			$result .= " ".$interval->format("%m")." ".(JText::_("LNG_MINUTES"));
		}
		
		return ($result); 
	}
	
	function base64_to_jpeg($base64_string, $output_file, $offerId) {
		jimport('joomla.filesystem.file');
		jimport('joomla.filesystem.folder');		

		$path = JBusinessUtil::makePathFile(JPATH_ROOT."/".PICTURES_PATH.OFFER_PICTURES_PATH.($offerId));

		if(!JFolder::exists($path)){			
			JFolder::create($path);
		}		
		$offer_pictures_file = JBusinessUtil::makePathFile($path."/".$output_file);
		$pathObject = new JFilesystemWrapperPath;
		$offer_pictures_file = $pathObject->clean($offer_pictures_file);
		if (is_writeable($path))
				{
					// Short circuit to prevent file permission errors
					$pathObject->setPermissions($path);					
				}
				else
				{
					return JText::sprintf('JLIB_FILESYSTEM_ERROR_WARNFS_ERR04', $offer_pictures_file, $offer_pictures_file);
				}	
		
		//return $offer_pictures_file;
		//$offer_pictures_file = $output_file;

		// open the output file for writing
		//$ifp = fopen( $offer_pictures_file, 'w' ); 	
		// split the string on commas
		// $data[ 0 ] == "data:image/png;base64"
		// $data[ 1 ] == <actual base64 string>		
		// we could add validation here with ensuring count( $data ) > 1
		//fwrite( $ifp, base64_decode( $data[ 1 ] ) );	
		// clean up the file resource
		//fclose( $ifp ); 	
		$data = explode( ',', $base64_string );	
		$guarda = JFile::write($offer_pictures_file, base64_decode( $data[ 1 ] ));
		$this->CambiarTamano($offer_pictures_file,800,800,$offer_pictures_file);		
		return $guarda; 
	}

	function CambiarTamano($imagenGuardada,$max_width,$max_height,$peque)
		{

		$InfoImage=getimagesize($imagenGuardada);               
						$width=$InfoImage[0];
						$height=$InfoImage[1];
						$type=$InfoImage[2];
		$max_height = $max_width;

			$x_ratio = $max_width / $width;
			$y_ratio = $max_height / $height;
			
		if (($x_ratio * $height) < $max_height) {
				$tn_height = ceil($x_ratio * $height);
				$tn_width = $max_width;
			} else {
				$tn_width = ceil($y_ratio * $width);
				$tn_height = $max_height;
			}
		$width=$tn_width;
		$height	=$tn_height;
		 
		switch($type)
                  {
                    case 1: //gif
                     {
                          $img = imagecreatefromgif($imagenGuardada);
                          $thumb = imagecreatetruecolor($width,$height);
                        imagecopyresampled($thumb,$img,0,0,0,0,$width,$height,imagesx($img),imagesy($img));
                        ImageGIF($thumb,$peque,100);
						
                        break;
                     }
                    case 2: //jpg,jpeg
                     {					 
                          $img = imagecreatefromjpeg($imagenGuardada);
                          $thumb = imagecreatetruecolor($width,$height);
                         imagecopyresampled($thumb,$img,0,0,0,0,$width,$height,imagesx($img),imagesy($img));
                         ImageJPEG($thumb,$peque);
                        break;
                     }
                    case 3: //png
                     {
                          $img = imagecreatefrompng($imagenGuardada);
                          $thumb = imagecreatetruecolor($width,$height);
                        imagecopyresampled($thumb,$img,0,0,0,0,$width,$height,imagesx($img),imagesy($img));
                        ImagePNG($thumb,$peque);
                        break;
                     }
        } // switch
	}	



	function storeOffer($data){

		

		// Get a row instance.
		$table = $this->getTable('Offer', 'JTable');

		// Load the row if saving an existing item.
		if ($data['id'] > 0)
		{
			$table->load($data['id']);
			$isNew = false;
			
		}

		// Bind the data.
		if (!$table->bind($data))
		{
			$this->setError($table->getError());
			echo json_encode($table->getError());die();
			return false;
		}

		// Check the data.
		if (!$table->check())
		{
			$this->setError($table->getError());
			echo json_encode($table->getError());die();
			return false;
		}

		// Store the data.
		if (!$table->store(true))
		{
			$this->setError($table->getError());
			echo json_encode($table->getError());die();
			return false;
		}

        $id = $table->id;
		$this->setState('offer.id', $table->id);

		if($isNew && empty($data["no-email"])){
			EmailService::sendNewOfferNotification($table);
		}
		
		//JBusinessDirectoryTranslations::saveTranslations(OFFER_DESCRIPTION_TRANSLATION, $table->id, 'description_');
		//JBusinessDirectoryAttachments::saveAttachments(OFFER_ATTACHMENTS, OFFER_ATTACHMENTS_PATH, $table->id, $data, $id);

		//$this->checkDates($data);

        // if no category is selected, create a dummy relation with categoryId = -1 so that
        // the insertOfferRelations function deletes all other existing relations
        if(!isset($data['categories']))
            $data['categories'] = array(-1);
		
			

		//save in companycategory table
		if(!empty( $data["categories"])){
			$table = $this->getTable('CompanyCategory');
			$table->insertOfferRelations( $id, $data["categories"]);
		}
		
		// Clean the cache
		$this->cleanCache();

		return $id;

	}
	

	function storePictures($data, $offerId, $oldId){		
	    $usedFiles = array();
	    if(!empty($data['pictures'])){
	      foreach ($data['pictures'] as $value) {
	        array_push($usedFiles, $value["picture_path"]);
	      }
	    }
		$pictures_path = JBusinessUtil::makePathFile(JPATH_ROOT."/".PICTURES_PATH);
		$offer_pictures_path = JBusinessUtil::makePathFile(OFFER_PICTURES_PATH.($offerId)."/");
		JBusinessUtil::removeUnusedFiles($usedFiles, $pictures_path, $offer_pictures_path);		
		$picture_ids 	= array();		
		foreach( $data['pictures'] as $value ){			
			$row = $this->getTable('OfferPictures', 'JTable');			
			//dbg($key);
			$pic 						= new stdClass();
			$pic->id		= 0;
			$pic->offerId 				= $offerId;
			$pic->picture_info	= $value['picture_info'];
			$pic->picture_path	= $value['picture_path'];
			$pic->picture_enable	= $value['picture_enable'];			
			//dbg($pic);
			//exit;
			if (!$row->bind($pic))
			{
				throw( new Exception($this->_db->getErrorMsg()) );
				$this->setError($this->_db->getErrorMsg());
					
			}
			// Make sure the record is valid
			if (!$row->check())
			{
				throw( new Exception($this->_db->getErrorMsg()) );
				$this->setError($this->_db->getErrorMsg());
			}
	
			// Store the web link table to the database
			if (!$row->store())
			{
				throw( new Exception($this->_db->getErrorMsg()) );
				$this->setError($this->_db->getErrorMsg());
			}
	
			$picture_ids[] = $this->_db->insertid();
		}

		$query = " DELETE FROM #__jbusinessdirectory_company_offer_pictures
		WHERE offerId = '".$offerId."'
		".( count($picture_ids)> 0 ? " AND id NOT IN (".implode(',', $picture_ids).")" : "");
	
		// dbg($query);
		//exit;
		$this->_db->setQuery( $query );
		if (!$this->_db->query()){
			throw( new Exception($this->_db->getErrorMsg()) );
		}
		//~prepare photos
	}

/*
	function resize_image($file, $offer_pictures_file, $w, $h, $quality=80) {
		list($width, $height) = getimagesize($file);
		$r = $width / $height;
		
			if ($w/$h > $r) {
				$newwidth = $h*$r;
				$newheight = $h;
			} else {
				$newheight = $w/$r;
				$newwidth = $w;
			}
		
		echo '$newwidth: ' .$newwidth;
		//Get file extension
		$exploding = explode(".",$file);
		$ext = end($exploding);
			 
		switch($ext)
			{
				case "gif":
			{
					$img = imagecreatefromgif($imagenGuardada);
					$thumb = imagecreatetruecolor($newwidth,$newheight);
					imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);	
				ImageGIF($offer_pictures_file,$offer_pictures_file,100);
				
				break;
			}
			case "jpeg":
			case "jpg":
			{					 
					$img = imagecreatefromjpeg($imagenGuardada);
					$thumb = imagecreatetruecolor($newwidth,$newheight);
					imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);	
				ImageJPEG($offer_pictures_file,$offer_pictures_file,80);
				break;
			}
			case "png":
			{
					$img = imagecreatefrompng($imagenGuardada);
					$thumb = imagecreatetruecolor($newwidth,$newheight);
					imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);	
				ImagePNG($offer_pictures_file,$offer_pictures_file,80);
				break;
			}
		} // switch	
		
		switch($ext){
			case "png":
				$src = imagecreatefrompng($file);
			break;
			case "jpeg":
			case "jpg":
				$src = imagecreatefromjpeg($file);
			break;
			case "gif":
				$src = imagecreatefromgif($file);
			break;
			default:
				$src = imagecreatefromjpeg($file);
			break;
		}		
		//return $destination;
		$dst = imagecreatetruecolor($newwidth, $newheight);
		imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);	

		switch($ext){
			case "png":
				imagepng($dst, $offer_pictures_file, $quality);
			break;
			case "jpeg":
			case "jpg":
				imagejpeg($dst, $offer_pictures_file, $quality);
			break;
			case "gif":
				imagegif($dst, $offer_pictures_file, $quality);
			break;
			default:
				imagejpeg($dst, $offer_pictures_file, $quality);
			break;
		}
		
		return $dst;
		
	}
*/
	/*function compress($source, $destination, $quality) {
		//Get file extension
		$exploding = explode(".",$source);
		$ext = end($exploding);
	
		switch($ext){
			case "png":
				$src = imagecreatefrompng($source);
			break;
			case "jpeg":
			case "jpg":
				$src = imagecreatefromjpeg($source);
			break;
			case "gif":
				$src = imagecreatefromgif($source);
			break;
			default:
				$src = imagecreatefromjpeg($source);
			break;
		}
		
		switch($ext){
			case "png":
				imagepng($src, $destination, $quality);
			break;
			case "jpeg":
			case "jpg":
				imagejpeg($src, $destination, $quality);
			break;
			case "gif":
				imagegif($src, $destination, $quality);
			break;
			default:
				imagejpeg($src, $destination, $quality);
			break;
		}
	
		return $destination;
	}*/
}

?>